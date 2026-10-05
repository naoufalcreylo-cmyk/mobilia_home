/* Mobilia — cart drawer on the Shopify Ajax Cart API + Section Rendering API.
   - Add: product form submit, [data-add-variant], [data-add-set] (comma-separated variant ids)
   - Change: quantity buttons/inputs and remove, by line key
   - After each mutation the "cart-drawer" section HTML comes back in the same response (sections param).
   Without JS, forms post to /cart/add and the cart page still works. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const M = window.Mobilia;
  const A = () => window.MobiliaAnalytics;
  const UI = () => window.MobiliaUI;
  const SECTION = 'cart-drawer';
  let busy = false;

  const drawer = () => $('[data-cart-drawer]');
  function swap(html) {
    if (!html) return;
    const wasOpen = drawer()?.classList.contains('is-open');
    const next = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-cart-drawer]');
    if (!next) return;
    if (wasOpen) { next.classList.add('is-open'); next.setAttribute('aria-hidden', 'false'); }
    drawer().replaceWith(next);
    UI()?.markLoaded(next);
  }
  function setCount(n) {
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = n || ''; el.dataset.count = n;
      el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
    });
  }
  async function refresh() {
    const res = await fetch(`${location.pathname}?sections=${SECTION}`);
    swap((await res.json())[SECTION]);
  }
  async function getCart() { return (await fetch(`${M.routes.cart}.js`)).json(); }
  const gaFromLine = l => ({ item_id: String(l.variant_id), item_name: l.product_title, item_variant: l.variant_title || undefined, price: l.final_price / 100, quantity: l.quantity });

  async function open() {
    UI()?.openLayer(drawer(), '[data-close].icon-btn');
    const cart = await getCart().catch(() => null);
    if (cart?.item_count) A()?.track('view_cart', { value: cart.total_price / 100, items: cart.items.map(gaFromLine) });
  }

  async function add(items, listName, errorEl) {
    if (busy) return; busy = true;
    try {
      const res = await fetch(`${M.routes.cartAdd}.js`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items, sections: SECTION, sections_url: location.pathname }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.description || data.message || M.strings.cartError);
      swap(data.sections?.[SECTION]);
      const cart = await getCart(); setCount(cart.item_count);
      const added = data.items || [data];
      A()?.track('add_to_cart', { value: added.reduce((s, l) => s + l.final_line_price / 100, 0), items: added.map(l => ({ ...gaFromLine(l), item_list_name: listName })) });
      if (errorEl) errorEl.hidden = true;
      open();
    } catch (err) {
      if (errorEl) { errorEl.textContent = err.message; errorEl.hidden = false; } else UI()?.toast(err.message);
    } finally { busy = false; }
  }

  async function change(key, quantity) {
    if (busy) return; busy = true;
    try {
      const before = await getCart();
      const line = before.items.find(l => l.key === key);
      const res = await fetch(`${M.routes.cartChange}.js`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: key, quantity, sections: SECTION, sections_url: location.pathname }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.description || M.strings.cartError);
      swap(data.sections?.[SECTION]); setCount(data.item_count);
      if (line && quantity < line.quantity) A()?.track('remove_from_cart', { value: (line.final_price * (line.quantity - quantity)) / 100, items: [{ ...gaFromLine(line), quantity: line.quantity - quantity }] });
    } catch (err) { UI()?.toast(err.message); } finally { busy = false; }
  }

  document.addEventListener('submit', e => {
    const form = e.target.closest('[data-product-form]'); if (!form) return;
    e.preventDefault();
    const fd = new FormData(form);
    add([{ id: +fd.get('id'), quantity: Math.max(1, +fd.get('quantity') || 1) }], 'product_page', form.querySelector('[data-form-error]'));
  });

  document.addEventListener('click', e => {
    const t = e.target;
    const v = t.closest('[data-add-variant]');
    if (v) { e.preventDefault(); return add([{ id: +v.dataset.addVariant, quantity: 1 }], v.dataset.list); }
    const set = t.closest('[data-add-set]');
    if (set) { e.preventDefault(); return add(set.dataset.addSet.split(',').filter(Boolean).map(id => ({ id: +id, quantity: 1 })), set.dataset.list); }
    const line = t.closest('[data-cart-drawer] .cart-line');
    if (line) {
      const qtyInput = line.querySelector('[data-qty-input]'); const cur = +qtyInput.value;
      const step = t.closest('[data-qty]');
      if (step) change(line.dataset.key, Math.max(0, cur + +step.dataset.qty));
      if (t.closest('[data-remove]')) change(line.dataset.key, 0);
    }
    if (t.closest('[data-checkout]')) {
      getCart().then(c => A()?.track('begin_checkout', { value: c.total_price / 100, items: c.items.map(gaFromLine) })).catch(() => {});
    }
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-cart-drawer] [data-qty-input]');
    if (input) change(input.closest('.cart-line').dataset.key, Math.max(0, +input.value || 0));
  });
  // Keep drawer in sync when the cart changes in another tab
  addEventListener('pageshow', e => { if (e.persisted) refresh(); });

  window.MobiliaCart = { open, add, change, refresh };
})();
