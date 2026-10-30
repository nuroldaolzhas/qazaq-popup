/* QAZAQ POP-UP service worker — офлайн режим.
   Файлдарды жаңартқан сайын CACHE нұсқасын өзгертіңіз (v3 → v4), сонда телефондар жаңа нұсқаны алады. */
const CACHE = 'qazaq-popup-v10';
const SHELL = [
  './', './index.html', './install.html', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png',
  './icons/maskable-192.png', './icons/maskable-512.png',
  './icons/apple-touch-icon.png', './icons/favicon-32.png',
  './images/abai.jpg',
  './images/abylai.jpg',
  './images/agash.jpg',
  './images/aimbetov.jpg',
  './images/aisha_bibi.jpg',
  './images/altybakan.jpg',
  './images/altynsarin.jpg',
  './images/asyk.jpg',
  './images/aubakirov.jpg',
  './images/audaryspak.jpg',
  './images/auezov.jpg',
  './images/baige.jpg',
  './images/baikonur.jpg',
  './images/baitursynuly.jpg',
  './images/bata.jpg',
  './images/baursak.jpg',
  './images/besik.jpg',
  './images/borik.jpg',
  './images/botai.jpg',
  './images/dauylpaz.jpg',
  './images/dombyra.jpg',
  './images/er_turman.jpg',
  './images/et.jpg',
  './images/farabi.jpg',
  './images/golden_man.jpg',
  './images/jochi.jpg',
  './images/kamzol.jpg',
  './images/kazsat.jpg',
  './images/kazy.jpg',
  './images/kiiz_ui.jpg',
  './images/kimeshek.jpg',
  './images/kobyz.jpg',
  './images/kokpar.jpg',
  './images/konak.jpg',
  './images/kumys.jpg',
  './images/kurmangazy.jpg',
  './images/kurt.jpg',
  './images/kyz_kuu.jpg',
  './images/magzhan.jpg',
  './images/mametova.jpg',
  './images/moldagulova.jpg',
  './images/momyshuly.jpg',
  './images/musabayev.jpg',
  './images/nauryz.jpg',
  './images/nauryz_kozhe.jpg',
  './images/oyu.jpg',
  './images/satbayev.jpg',
  './images/saukele.jpg',
  './images/shankobyz.jpg',
  './images/shapan.jpg',
  './images/shashu.jpg',
  './images/shokan.jpg',
  './images/shubat.jpg',
  './images/suiinshi.jpg',
  './images/sybyzgy.jpg',
  './images/takiya.jpg',
  './images/tamgaly.jpg',
  './images/tekemet.jpg',
  './images/togyz.jpg',
  './images/tusaukeser.jpg',
  './images/ush_bi.jpg',
  './images/yasawi.jpg',
  './images/zerger.jpg',
  './images/zhansugurov.jpg',
  './images/zhetigen.jpg'
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
