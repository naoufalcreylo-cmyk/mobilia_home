/* Bootstrap: shared chrome on every page, then the page module named by <body data-page>. */
import { loadData, markLoaded } from './core.js';
import { injectIcons } from './icons.js';
import { mountChrome } from './ui.js';

document.documentElement.classList.remove('no-js');
injectIcons();
const page = document.body.dataset.page;

loadData().then(async db => {
  mountChrome(db);
  if (page === 'home') (await import('./home.js')).mountHome(db);
  if (page === 'collection') (await import('./collection.js')).mountCollection(db);
  if (page === 'product') (await import('./product.js')).mountProduct(db);
  markLoaded();
}).catch(err => {
  console.error(err);
  document.getElementById('main').innerHTML = `<div class="error-state"><div><p class="display">Oups.</p>
    <p>Le catalogue n’a pas pu être chargé. Vérifiez votre connexion, puis réessayez.</p>
    <a class="btn" href="">Réessayer</a></div></div>`;
});
