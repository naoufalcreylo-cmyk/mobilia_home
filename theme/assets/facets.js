/* Mobilia — collection/search filtering via the Section Rendering API.
   Filter, sort and "load more" fetch the same URL with section_id and swap only the dynamic regions;
   the URL is kept in sync (shareable, back-button friendly). Works without JS as plain links/forms. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const REGIONS = ['[data-plp-count]', '[data-active-filters]', '[data-plp-grid]', '[data-filters]', '[data-plp-more]', '[data-filters-toggle] .count'];

  const root = () => $('[data-plp]');
  const sectionId = () => root()?.dataset.sectionId;
  const isDrawer = () => matchMedia('(max-width: 1023px)').matches;

  async function load(url, { append = false, push = true } = {}) {
    const u = new URL(url, location.origin);
    u.searchParams.set('section_id', sectionId());
    const grid = $('[data-plp-grid]');
    grid.setAttribute('aria-busy', 'true'); grid.style.opacity = append ? '' : '.45';
    try {
      const html = await (await fetch(u)).text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      if (append) {
        const before = grid.children.length;
        grid.append(...doc.querySelector('[data-plp-grid]').children);
        grid.children[before]?.querySelector('a[href*="/products/"]:not([tabindex="-1"])')?.focus({ preventScroll: true });
        $('[data-plp-more]').replaceWith(doc.querySelector('[data-plp-more]'));
      } else {
        const keepOpen = $('[data-filters]')?.classList.contains('is-open');
        const focusName = document.activeElement?.name, focusVal = document.activeElement?.value;
        REGIONS.forEach(sel => { const a = $(sel), b = doc.querySelector(sel); if (a && b) a.replaceWith(b); });
        if (keepOpen) $('[data-filters]').classList.add('is-open');
        if (focusName) $$(`[name="${CSS.escape(focusName)}"]`).find(i => i.value === focusVal)?.focus();
      }
      u.searchParams.delete('section_id');
      if (push) history.replaceState(null, '', u.pathname + (u.search || ''));
      window.MobiliaUI?.markLoaded(grid); window.MobiliaUI?.syncWish(); window.MobiliaAnalytics?.observeLists(root());
    } finally { grid.removeAttribute('aria-busy'); grid.style.opacity = ''; }
  }

  function formUrl() {
    const form = $('[data-facets-form]');
    const params = new URLSearchParams(new FormData(form));
    for (const [k, v] of [...params]) if (v === '') params.delete(k);
    const sort = $('[data-sort]'); if (sort) params.set('sort_by', sort.value);
    return `${location.pathname}?${params}`;
  }

  document.addEventListener('change', e => {
    if (e.target.closest('[data-facets-form]')) {
      if (e.target.type === 'number') return; // price: apply on blur/enter
      load(formUrl());
      window.dataLayer?.push({ event: 'filter_apply', filter_name: e.target.name, filter_value: e.target.value });
    }
    if (e.target.matches('[data-sort]')) load(formUrl());
  });
  let priceT;
  document.addEventListener('input', e => {
    if (e.target.closest('[data-facets-form]') && e.target.type === 'number') { clearTimeout(priceT); priceT = setTimeout(() => load(formUrl()), 700); }
  });
  document.addEventListener('submit', e => { if (e.target.matches('[data-facets-form]')) { e.preventDefault(); load(formUrl()); } });

  document.addEventListener('click', e => {
    const t = e.target;
    const link = t.closest('[data-facet-link]'); if (link) { e.preventDefault(); load(link.href); return; }
    const more = t.closest('[data-load-more]'); if (more) { e.preventDefault(); load(more.href, { append: true, push: false }); return; }
    const toggle = t.closest('[data-filters-toggle]');
    if (toggle) {
      const plp = $('.plp'); const filters = $('[data-filters]');
      if (isDrawer()) { filters.classList.add('is-open'); toggle.setAttribute('aria-expanded', 'true'); document.documentElement.classList.add('is-locked'); setTimeout(() => $('summary', filters)?.focus(), 50); }
      else { plp.classList.toggle('filters-collapsed'); toggle.setAttribute('aria-expanded', String(!plp.classList.contains('filters-collapsed'))); }
      return;
    }
    if (t.closest('[data-filters-close]')) {
      $('[data-filters]').classList.remove('is-open'); document.documentElement.classList.remove('is-locked');
      const tg = $('[data-filters-toggle]'); tg?.setAttribute('aria-expanded', 'false'); tg?.focus();
    }
    const d = t.closest('[data-density]');
    if (d) { $('.plp').dataset.density = d.dataset.density; $$('[data-density]').forEach(b => b.setAttribute('aria-pressed', b === d)); }
  });
  document.addEventListener('keydown', e => {
    const f = $('[data-filters].is-open');
    if (e.key === 'Escape' && f) { f.classList.remove('is-open'); document.documentElement.classList.remove('is-locked'); $('[data-filters-toggle]')?.focus(); }
  });
  addEventListener('popstate', () => load(location.href, { push: false }));
})();
