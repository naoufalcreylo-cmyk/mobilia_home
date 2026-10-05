/* Mobilia — predictive search: /search/suggest with section rendering (sections/predictive-search.liquid).
   Debounced, cancels stale requests, announces result counts to screen readers. */
(() => {
  const M = window.Mobilia;
  let timer, controller, lastTracked = '';

  async function suggest(q, box, status) {
    controller?.abort(); controller = new AbortController();
    const url = `${M.routes.predictiveSearch}?q=${encodeURIComponent(q)}&resources[type]=product,collection,query&resources[limit]=8&resources[options][unavailable_products]=last&section_id=predictive-search`;
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) return;
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      const results = doc.querySelector('[data-ps-results]');
      if (!results) return;
      box.replaceChildren(results);
      const n = results.querySelectorAll('.search__product').length;
      status.textContent = n ? `${n} produits suggérés` : 'Aucun résultat';
      window.MobiliaUI?.markLoaded(box);
      if (q.length > 2 && q !== lastTracked) { lastTracked = q; window.dataLayer.push({ event: 'search', search_term: q }); }
    } catch (err) { if (err.name !== 'AbortError') console.warn(err); }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('q'); if (!input) return;
    const box = document.getElementById('search-results'); const status = document.getElementById('search-status');
    const initial = box.innerHTML;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      const q = input.value.trim();
      if (!q) { box.innerHTML = initial; status.textContent = ''; return; }
      timer = setTimeout(() => suggest(q, box, status), 180);
    });
    input.closest('form').addEventListener('submit', e => { if (!input.value.trim()) e.preventDefault(); });
  });
})();
