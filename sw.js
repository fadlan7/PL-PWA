const CACHE_NAME = "PL-PWA";
let urlsToCache = [
  "/",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://unpkg.com/sweetalert/dist/sweetalert.min.js",
  "/assets/img/icon/apple-touch-icon.png",
  "/assets/img/icon/icon-512x512.png",
  "/assets/img/icon/icon-384x384.png",
  "/assets/img/icon/icon-192x192.png",
  "/assets/img/icon/icon-152x152.png",
  "/assets/img/icon/icon-144x144.png",
  "/assets/img/icon/icon-128x128.png",
  "/assets/img/icon/icon-96x96.png",
  "/assets/img/icon/icon-72x72.png",
  "/assets/img/icon/icon-32x32.ico",
  "/assets/img/icon/icon-16x16.ico",
  "/assets/css/materialize.min.css",
  "/assets/css/style.css",
  "/assets/js/api.js",
  "/assets/js/db.js",
  "/assets/js/idb.js",
  "/assets/js/materialize.min.js",
  "/assets/js/nav.js",
  "/assets/js/reg-sw.js",
  "/pages/home.html",
  "/pages/team-favorite.html",
  "/pages/about.html",
  "/pages/detail-team.html",
  "/index.html",
  "/nav.html",
  "/manifest.json",
  "/push.js"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  let base_url = "https://api.football-data.org/v2/";

  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function (cache) {
        return fetch(event.request).then(function (response) {
          cache.put(event.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    event.respondWith(
      caches
        .match(event.request, {
          ignoreSearch: true,
        })
        .then(function (response) {
          return response || fetch(event.request);
        })
    );
  }
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName != CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("push", function (event) {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }

  let options = {
    body: body,
    badge: "/assets/img/icon/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});
