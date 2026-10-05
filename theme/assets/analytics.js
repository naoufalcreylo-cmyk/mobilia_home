/* Mobilia — analytics layer.
   Single source of ecommerce events in GA4 schema, pushed to window.dataLayer.
   Configure GA4 / Meta Pixel / Google Ads / TikTok as GTM tags reading these events, so nothing is sent twice.
   Shopify's own checkout events (begin_checkout → purchase) remain tracked by Shopify Customer Events / pixels;
   this file only covers storefront interactions. */
(() => {
  window.dataLayer = window.dataLayer || [];
  const currency = (window.Mobilia && window.Mobilia.currency) || 'MAD';

  const track = (event, ecommerce, extra = {}) => {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({ event, ecommerce: { currency, ...ecommerce }, ...extra });
  };
  const itemFrom = (el, extra = {}) => {
    try { return { quantity: 1, ...JSON.parse(el.dataset.ga), ...extra }; } catch { return null; }
  };

  // view_item_list: once per list, when at least a quarter of it is visible
  const seen = new WeakSet();
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || seen.has(e.target)) return;
      seen.add(e.target); io.unobserve(e.target);
      const name = e.target.dataset.list;
      const items = [...e.target.querySelectorAll('[data-ga]')].map((el, i) => itemFrom(el, { index: i, item_list_name: name })).filter(Boolean);
      if (items.length) track('view_item_list', { item_list_name: name, items });
    });
  }, { threshold: 0.25 }) : null;
  const observeLists = (root = document) => root.querySelectorAll('[data-list]').forEach(l => io && io.observe(l));

  // select_item on product links; whatsapp_click with context
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href*="/products/"]');
    const card = link && link.closest('[data-ga]');
    if (card) {
      const list = card.closest('[data-list]')?.dataset.list || 'unknown';
      track('select_item', { item_list_name: list, items: [itemFrom(card, { item_list_name: list })] });
    }
    const wa = e.target.closest('a[href^="https://wa.me"]');
    if (wa) window.dataLayer.push({ event: 'whatsapp_click', whatsapp_context: wa.dataset.waContext || 'general', page_type: document.body.className.replace(/.*template-(\S+).*/, '$1') });
  });

  document.addEventListener('DOMContentLoaded', () => {
    observeLists();
    const pdp = document.querySelector('[data-product-ga]');
    if (pdp) { try { const item = JSON.parse(pdp.textContent); track('view_item', { value: item.price, items: [{ ...item, quantity: 1 }] }); } catch { /* malformed */ } }
  });

  window.MobiliaAnalytics = { track, itemFrom, observeLists };
})();
