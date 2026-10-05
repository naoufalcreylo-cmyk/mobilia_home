/* Mobilia line-icon set (24px grid, 1.5 stroke). Injected once as an SVG sprite. */
const P = {
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  user: '<circle cx="12" cy="8.5" r="3.75"/><path d="M4.75 20c.9-3.6 3.8-5.5 7.25-5.5s6.35 1.9 7.25 5.5"/>',
  heart: '<path d="M12 19.5s-7.25-4.3-7.25-9.6A4.05 4.05 0 0 1 12 7.4a4.05 4.05 0 0 1 7.25 2.5c0 5.3-7.25 9.6-7.25 9.6Z"/>',
  bag: '<path d="M5.25 8.25h13.5l-1 11.5H6.25l-1-11.5Z"/><path d="M8.75 8.25V7a3.25 3.25 0 0 1 6.5 0v1.25"/>',
  menu: '<path d="M3.75 7.5h16.5M3.75 12h16.5M3.75 16.5h10"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  arrow: '<path d="M4 12h15.5M14 6.5 19.5 12 14 17.5"/>',
  'arrow-l': '<path d="M20 12H4.5M10 6.5 4.5 12l5.5 5.5"/>',
  chev: '<path d="m6.5 9.5 5.5 5.5 5.5-5.5"/>',
  'chev-r': '<path d="m9.5 6.5 5.5 5.5-5.5 5.5"/>',
  'chev-l': '<path d="m14.5 6.5-5.5 5.5 5.5 5.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  filter: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  grid2: '<rect x="4" y="4" width="7" height="16"/><rect x="13" y="4" width="7" height="16"/>',
  grid4: '<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>',
  zoom: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2M11 8.5v5M8.5 11h5"/>',
  eye: '<path d="M2.75 12S6 5.75 12 5.75 21.25 12 21.25 12 18 18.25 12 18.25 2.75 12 2.75 12Z"/><circle cx="12" cy="12" r="2.75"/>',
  truck: '<path d="M2.75 6.75h11v9.5h-11zM13.75 9.75h4l3.5 3.5v3h-7.5"/><circle cx="7" cy="17.5" r="1.75"/><circle cx="17.5" cy="17.5" r="1.75"/>',
  pin: '<path d="M12 21s-6.75-6-6.75-11.25a6.75 6.75 0 0 1 13.5 0C18.75 15 12 21 12 21Z"/><circle cx="12" cy="9.75" r="2.5"/>',
  tool: '<path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3l7.5-7.5a4 4 0 0 0-2-2Z"/><path d="m4 4 5 5"/>',
  spark: '<path d="M12 3.5 13.9 10 20.5 12l-6.6 2L12 20.5 10.1 14 3.5 12l6.6-2L12 3.5Z"/>',
  card: '<rect x="3" y="5.75" width="18" height="12.5" rx="1"/><path d="M3 9.75h18M6.5 14.75h4"/>',
  ruler: '<path d="m3.5 15.5 12-12 5 5-12 12-5-5Z"/><path d="m7 12 2 2M10 9l2 2M13 6l2 2"/>',
  gift: '<rect x="3.75" y="8.5" width="16.5" height="4" /><path d="M5.25 12.5v8h13.5v-8M12 8.5v12M12 8.5S10.5 4 8.25 4.75C6 5.5 7.5 8.5 12 8.5Zm0 0s1.5-4.5 3.75-3.75C18 5.5 16.5 8.5 12 8.5Z"/>',
  chat: '<path d="M4 5.75h16v10.5H9.5L5.5 20v-3.75H4z"/><path d="M8 10.25h8M8 13h5"/>',
  phone: '<path d="M6.5 3.75h3l1.5 4.5-2 1.25a11 11 0 0 0 5.5 5.5l1.25-2 4.5 1.5v3a2 2 0 0 1-2 2A16.25 16.25 0 0 1 4.5 5.75a2 2 0 0 1 2-2Z"/>',
  map: '<path d="m3.75 6.5 5.25-2 6 2 5.25-2v13l-5.25 2-6-2-5.25 2z"/><path d="M9 4.5v13M15 6.5v13"/>',
  shield: '<path d="M12 3.5 19.25 6v5.5c0 4.5-3 7.75-7.25 9-4.25-1.25-7.25-4.5-7.25-9V6L12 3.5Z"/><path d="m9 12 2.25 2.25L15.5 10"/>',
  store: '<path d="M4 9.5h16M4.75 9.5l1-5h12.5l1 5M5.5 9.5v10h13v-10M10 19.5v-5h4v5"/>',
  dims: '<path d="M3.5 8.5h17v7h-17z"/><path d="M7 8.5v3M10.5 8.5v2M14 8.5v3M17.5 8.5v2"/>',
  whatsapp: '<path d="M4.5 19.5 5.6 16A8.25 8.25 0 1 1 8.4 18.6l-3.9.9Z"/><path d="M9.2 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c-.1.1-.2.3 0 .5.3.6 1.4 1.9 2.7 2.4.2.1.4 0 .5-.1l.6-.7c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.4.5 0 .6-.3 1.4-1.1 1.7-.8.3-1.9.2-3.6-.6-2.1-1-3.5-3.3-3.7-3.8-.2-.6-.4-1.6.2-2.8Z"/>',
  instagram: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.75"/><circle cx="16.75" cy="7.25" r=".6" fill="currentColor"/>',
  facebook: '<path d="M13.5 20.5v-7h2.5l.5-3h-3V8.75c0-.9.4-1.5 1.6-1.5h1.5V4.6A17 17 0 0 0 14.5 4.5c-2.3 0-3.75 1.4-3.75 3.9v2.1H8.25v3h2.5v7"/>',
  tiktok: '<path d="M14 4v10.25a3.25 3.25 0 1 1-3.25-3.25"/><path d="M14 4c.4 2.4 2 3.9 4.5 4.1"/>',
  youtube: '<rect x="3" y="6" width="18" height="12" rx="3.5"/><path d="m10.5 9.5 4 2.5-4 2.5z"/>',
};
export function injectIcons() {
  const s = Object.entries(P).map(([k, v]) =>
    `<symbol id="i-${k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${v}</symbol>`).join('');
  document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${s}</svg>`);
}
export const icon = (name, cls = '') => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
