/* RECOMP FIGHT CAMP — Service Worker v3 */
const CACHE = 'recomp-v6';
const SHELL = [
  './', './index.html', './css/style.css',
  './js/config.js', './js/exercises.js', './js/knowledge.js',
  './js/data.js', './js/coach.js', './js/rpg.js', './js/music.js', './js/app.js',
  './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.hostname.includes('supabase')) return;
  if (url.origin !== location.origin) {
    if (e.request.method === 'GET' && (url.hostname.includes('fonts.g') || url.hostname.includes('esm.sh'))) {
      e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => { caches.open(CACHE).then(c => c.put(e.request, res.clone())); return res; }).catch(() => hit)));
    }
    return;
  }
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(e.request);
    const fresh = fetch(e.request).then(res => { if (res && res.ok) cache.put(e.request, res.clone()); return res; }).catch(() => null);
    return hit || fresh;
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) if ('focus' in c) return c.focus();
    return clients.openWindow('./');
  }));
});
