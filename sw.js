// Release rule: bump V together with VERSION in index.html. Installed users then get the update prompt automatically.
const V='mte-studio-v0.3.0';
const CORE=['./','index.html','manifest.webmanifest','icon.svg','icon-180.png','icon-192.png','icon-512.png','icon-maskable-512.png'];
const LIBS=['https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js','https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js','https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js','https://cdn.jsdelivr.net/npm/ag-psd@28.2.0/dist/bundle.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>Promise.allSettled([...CORE,...LIBS].map(u=>c.add(u))))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
  const net=fetch(e.request).then(r=>{if(r.ok||r.type==='opaque')caches.open(V).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>hit);
  return hit||net}))});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
