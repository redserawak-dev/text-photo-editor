const CACHE='frame-shell-0.3.1';
const FILES=['./','./index.html','./styles.css','./ui.css','./engine.js','./font-zip.js','./app.js','./manifest.webmanifest','./assets/demo.jpg','./assets/palm.jpg','./assets/portrait.jpg','./assets/icon.svg','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('frame-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request)));});
