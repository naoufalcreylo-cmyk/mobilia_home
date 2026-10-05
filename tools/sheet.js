// Builds HTML contact sheets of collection + product images for curation.
const fs=require('fs');const R='research/';
const cols=JSON.parse(fs.readFileSync(R+'collections.json')).collections;
const sz=(u,w)=>u+(u.includes('?')?'&':'?')+'width='+w;
const cell=(u,l)=>`<figure><img src="${sz(u,260)}" loading="eager"><figcaption>${l}</figcaption></figure>`;
const page=(cells)=>`<style>body{margin:0;font:11px sans-serif;display:grid;grid-template-columns:repeat(8,1fr);gap:4px}figure{margin:0}img{width:100%;aspect-ratio:1;object-fit:cover;display:block}figcaption{height:28px;overflow:hidden}</style>`+cells.join('');
fs.writeFileSync('sheet-cols.html',page(cols.filter(c=>c.image).map(c=>cell(c.image.src,c.handle))));
const pick=process.argv[2].split(',');let i=0;const map={};
const cells=[];for(const h of pick){const p=JSON.parse(fs.readFileSync(R+'cols/'+h+'.json')).products.slice(0,+process.argv[3]||24);
for(const x of p){if(!x.images[0])continue;const k=(i++).toString();map[k]=x.handle;cells.push(cell(x.images[0].src,k+' '+x.handle))}}
fs.writeFileSync('sheet-p.html',page(cells));fs.writeFileSync('sheet-map.json',JSON.stringify(map));console.log(i);
