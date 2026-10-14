// Bump V on every release: installed users get the update prompt automatically.
const V='mte-studio-v1';
const CORE=['./','index.html','manifest.webmanifest','icon.svg'];
const LIBS=['https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js','https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js','https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js','https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js','https://cdn.jsdelivr.net/npm/ag-psd@28.2.0/dist/bundle.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>Promise.allSettled([...CORE,...LIBS].map(u=>c.add(u))))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
  const net=fetch(e.request).then(r=>{if(r.ok||r.type==='opaque')caches.open(V).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>hit);
  return hit||net}))});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
