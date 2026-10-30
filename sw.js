/* QAZAQ POP-UP service worker — офлайн режим.
   Файлдарды жаңартқан сайын CACHE нұсқасын өзгертіңіз (v3 → v4), сонда телефондар жаңа нұсқаны алады. */
const CACHE = 'qazaq-popup-v11';
const SHELL = [
  './', './index.html', './install.html', './manifest.json',
  './icon-192.png', './icon-512.png',
  './maskable-192.png', './maskable-512.png',
  './apple-touch-icon.png', './favicon-32.png',
  './abai.jpg',
  './abylai.jpg',
  './agash.jpg',
  './aimbetov.jpg',
  './aisha_bibi.jpg',
  './altybakan.jpg',
  './altynsarin.jpg',
  './asyk.jpg',
  './aubakirov.jpg',
  './audaryspak.jpg',
  './auezov.jpg',
  './baige.jpg',
  './baikonur.jpg',
  './baitursynuly.jpg',
  './bata.jpg',
  './baursak.jpg',
  './besik.jpg',
  './borik.jpg',
  './botai.jpg',
  './dauylpaz.jpg',
  './dombyra.jpg',
  './er_turman.jpg',
  './et.jpg',
  './farabi.jpg',
  './golden_man.jpg',
  './jochi.jpg',
  './kamzol.jpg',
  './kazsat.jpg',
  './kazy.jpg',
  './kiiz_ui.jpg',
  './kimeshek.jpg',
  './kobyz.jpg',
  './kokpar.jpg',
  './konak.jpg',
  './kumys.jpg',
  './kurmangazy.jpg',
  './kurt.jpg',
  './kyz_kuu.jpg',
  './magzhan.jpg',
  './mametova.jpg',
  './moldagulova.jpg',
  './momyshuly.jpg',
  './musabayev.jpg',
  './nauryz.jpg',
  './nauryz_kozhe.jpg',
  './oyu.jpg',
  './satbayev.jpg',
  './saukele.jpg',
  './shankobyz.jpg',
  './shapan.jpg',
  './shashu.jpg',
  './shokan.jpg',
  './shubat.jpg',
  './suiinshi.jpg',
  './sybyzgy.jpg',
  './takiya.jpg',
  './tamgaly.jpg',
  './tekemet.jpg',
  './togyz.jpg',
  './tusaukeser.jpg',
  './ush_bi.jpg',
  './yasawi.jpg',
  './zerger.jpg',
  './zhansugurov.jpg',
  './zhetigen.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Maps — тек интернеттен
  if (/google\.com$|googleapis\.com$|gstatic\.com$/.test(url.hostname) && !/fonts\./.test(url.hostname)) return;

  // APK файлы — кэшке салмай, тікелей желіден
  if (url.pathname.endsWith('.apk')) return;

  // HTML беттер: алдымен желі (жаңа нұсқа), болмаса кэш
  if (req.mode === 'navigate') {
    const page = url.pathname.endsWith('install.html') ? './install.html' : './index.html';
    e.respondWith(
      fetch(req).then(res => {
        const type = res.headers.get('content-type') || '';
        if (res.ok && type.includes('text/html')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(page, copy)); }
        return res;
      }).catch(() => caches.match(page))
    );
    return;
  }

  // Қалғаны (белгішелер, Google қаріптері): алдымен кэш, сосын желі
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => hit))
  );
});
