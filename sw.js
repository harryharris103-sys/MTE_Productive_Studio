// Release rule: bump V together with VERSION in index.html. Installed users then get the update prompt automatically.
const V='mte-studio-v0.0.6';
const CORE=['./','index.html','manifest.webmanifest','icon.svg','video.html','office.html','lo.html','lo-thread.js','zeta.js'];
const LIBS=['https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js','https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js','https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js','https://cdn.jsdelivr.net/npm/ag-psd@28.2.0/dist/bundle.js','https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js','https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>Promise.allSettled([...CORE,...LIBS].map(u=>c.add(u))))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>clients.claim())));
/* lo.html must be cross-origin isolated for LibreOffice WASM (threads). GitHub Pages cannot set headers, so add them here. */
const iso=r=>{if(!r)return Response.error();const h=new Headers(r.headers);h.set('Cross-Origin-Opener-Policy','same-origin');h.set('Cross-Origin-Embedder-Policy','credentialless');return new Response(r.body,{status:r.status,statusText:r.statusText,headers:h})};
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);if(u.origin===location.origin&&u.pathname.endsWith('/lo.html')){e.respondWith(fetch(e.request).catch(()=>caches.match(e.request,{ignoreSearch:true})).then(iso));return}
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
  const net=fetch(e.request).then(r=>{if(r.ok||r.type==='opaque')caches.open(V).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>hit);
  return hit||net}))});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
