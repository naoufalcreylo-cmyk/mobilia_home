/* Mobilia — product page: swipe gallery dots, lightbox with zoom, quantity, variant picker,
   WhatsApp message sync (product, variant, quantity), sticky mobile buy bar. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = $('[data-product]'); if (!root) return;
  const form = $('[data-product-form]', root);
  const qty = form?.querySelector('input[name="quantity"]');
  const M = window.Mobilia;

  /* WhatsApp: rebuild the message with the chosen variant & quantity */
  const waBase = $$('[data-wa-product]').map(a => ({ a, url: new URL(a.href) }));
  function syncWa(variantTitle) {
    waBase.forEach(({ a, url }) => {
      const text = url.searchParams.get('text') || '';
      let next = text.replace(/(Quantité : )\d+/, `$1${qty ? qty.value : 1}`);
      if (variantTitle) next = next.replace(/^(.*\n• [^\n—]+)(?: — [^\n]+)?/, `$1 — ${variantTitle}`);
      const u = new URL(url); u.searchParams.set('text', next); a.href = u.toString();
    });
  }

  /* Quantity stepper */
  root.addEventListener('click', e => {
    const s = e.target.closest('[data-step]'); if (!s || !qty) return;
    qty.value = Math.max(1, Math.min(99, +qty.value + +s.dataset.step)); syncWa();
  });
  qty?.addEventListener('change', () => { qty.value = Math.max(1, Math.min(99, +qty.value || 1)); syncWa(); });

  /* Variant picker (options → variant id, price, availability, URL) */
  const picker = $('[data-variant-picker]');
  if (picker) {
    const variants = JSON.parse($('[data-variants]', picker).textContent);
    const money = cents => (M.moneyFormat || '{{amount}}').replace(/\{\{\s*(\w+)\s*\}\}/, (m, k) => {
      const v = (cents / 100).toFixed(k.includes('no_decimals') ? 0 : 2);
      return k.includes('space') || k.includes('no_decimals') ? Number(v).toLocaleString('fr-FR') : v;
    });
    picker.addEventListener('change', () => {
      const chosen = $$('fieldset', picker).map(f => $('input:checked', f)?.value);
      $$('fieldset', picker).forEach((f, i) => { $('[data-option-value]', f).textContent = chosen[i]; });
      const v = variants.find(x => x.options.every((o, i) => o === chosen[i]));
      if (!v) return;
      $('[data-variant-input]', form).value = v.id;
      const btn = $('[data-add-main]', form); btn.disabled = !v.available;
      const price = $('[data-price] .price'); if (price) price.textContent = money(v.price);
      const bb = $('[data-buybar-price]'); if (bb) bb.textContent = money(v.price);
      history.replaceState(null, '', `${root.dataset.url}?variant=${v.id}`);
      syncWa(v.title);
    });
  }

  /* Gallery dots (mobile swipe) */
  const g = $('[data-gallery]'); const dots = $$('.gallery__dots span');
  if (g && dots.length) g.addEventListener('scroll', () => {
    const i = Math.round(g.scrollLeft / g.clientWidth); dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
  }, { passive: true });

  /* Lightbox */
  const lb = $('#lightbox'); const items = $$('.gallery__item[data-full]');
  if (lb && items.length) {
    const stage = $('[data-lb-stage]', lb); const im = $('[data-lb-img]', lb);
    let idx = 0, opener;
    const show = i => {
      idx = (i + items.length) % items.length; stage.classList.remove('is-zoomed');
      im.src = items[idx].dataset.full; im.alt = items[idx].querySelector('img')?.alt || '';
      $('[data-lb-count]', lb).textContent = `${idx + 1} / ${items.length}`;
      $$('[data-lb-go]', lb).forEach((b, k) => b.setAttribute('aria-current', k === idx));
    };
    const open = i => { opener = document.activeElement; show(i); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('is-locked'); $('[data-lb-close]', lb).focus(); };
    const close = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('is-locked'); opener?.focus(); };
    items.forEach(f => f.addEventListener('click', e => { if (!e.target.closest('video, iframe')) open(+f.dataset.index); }));
    const origin = e => { const r = im.getBoundingClientRect(); im.style.setProperty('--ox', `${((e.clientX - r.left) / r.width) * 100}%`); im.style.setProperty('--oy', `${((e.clientY - r.top) / r.height) * 100}%`); };
    lb.addEventListener('click', e => {
      const t = e.target;
      if (t.closest('[data-lb-close]')) return close();
      if (t.closest('[data-lb]')) return show(idx + +t.closest('[data-lb]').dataset.lb);
      if (t.closest('[data-lb-go]')) return show(+t.closest('[data-lb-go]').dataset.lbGo);
      if (t === im) { origin(e); stage.classList.toggle('is-zoomed'); }
    });
    stage.addEventListener('mousemove', e => { if (stage.classList.contains('is-zoomed')) origin(e); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'Tab') { const f = $$('button', lb).filter(b => b.offsetParent); const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f.at(-1).focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
    });
    let x0 = null;
    stage.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => { if (x0 == null || stage.classList.contains('is-zoomed')) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1)); x0 = null; });
  }

  /* Sticky buy bar (mobile/tablet): appears once the main form scrolls away */
  const bar = $('[data-buybar]');
  if (bar && form) {
    document.body.classList.add('has-buybar');
    new IntersectionObserver(([en]) => {
      const on = !en.isIntersecting && en.boundingClientRect.top < 0;
      bar.classList.toggle('is-on', on); bar.setAttribute('aria-hidden', String(!on));
      $$('a,button', bar).forEach(el => { el.tabIndex = on ? 0 : -1; });
    }).observe(form);
    $('[data-buybar-add]', bar)?.addEventListener('click', () => form.requestSubmit());
  }

  /* Complementary recommendations fallback (when no curated metafield) */
  const rec = $('[data-recommendations]');
  if (rec) fetch(rec.dataset.recommendations).then(r => r.text()).then(html => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const next = doc.querySelector('[data-list="complete_the_room"]')?.closest('section');
    if (next && next.querySelector('.card')) { rec.replaceWith(next); next.hidden = false; window.MobiliaUI?.markLoaded(next); window.MobiliaAnalytics?.observeLists(next); }
  }).catch(() => {});
})();
