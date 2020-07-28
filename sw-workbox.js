importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

console.log("Workbox :" + workbox ? "successfully loaded" : "failed to load")



workbox.precaching.precacheAndRoute([
  { url: "/index.html", revision: "1" },
  { url: "/nav.html", revision: "1" },
  { url: "/manifest.json", revision: "1" },
  { url: "/push.js", revision: "1" },
  { url: "/sw-workbox.js", revision: "1" },

  { url: "/assets/css/materialize.min.css", revision: "1" },
  { url: "/assets/css/style.css", revision: "1" },
  { url: "/assets/js/api.js", revision: "1" },
  { url: "/assets/js/db.js", revision: "1" },
  { url: "/assets/js/idb.js", revision: "1" },
  { url: "/assets/js/materialize.min.js", revision: "1" },
  { url: "/assets/js/nav.js", revision: "1" },
  { url: "/assets/js/reg-sw.js", revision: "1" },

  { url: "/assets/img/icon/apple-touch-icon.png", revision: "1" },
  { url: "/assets/img/icon/icon-384x384.png", revision: "1" },
  { url: "/assets/img/icon/icon-192x192.png", revision: "1" },
  { url: "/assets/img/icon/icon-152x152.png", revision: "1" },
  { url: "/assets/img/icon/icon-144x144.png", revision: "1" },
  { url: "/assets/img/icon/icon-128x128.png", revision: "1" },
  { url: "/assets/img/icon/icon-96x96.png", revision: "1" },
  { url: "/assets/img/icon/icon-72x72.png", revision: "1" },

  { url: "/assets/img/icon/icon-32x32.ico", revision: "1" },
  { url: "/assets/img/icon/icon-16x16.ico", revision: "1" },
  { url: "/assets/img/icon/error.png", revision: "1" },

  { url: "/pages/home.html", revision: "1" },
  { url: "/pages/team-favorite.html", revision: "1" },
  { url: "/pages/about.html", revision: "1" },
  { url: "/pages/detail-team.html", revision: "1" },
]);

workbox.routing.registerRoute(
  /\.(?:css|js)$/,
  new workbox.strategies.CacheFirst({
      cacheName: 'Javascript',
      plugins: [
          new workbox.expiration.ExpirationPlugin({
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30
          })
      ]
  })
)

workbox.routing.registerRoute(
  new RegExp("https://api.football-data.org"),
  new workbox.strategies.NetworkFirst({
    cacheName: "ApiFootball",
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24,
        maxEntries: 30,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  new RegExp("https://fonts.googleapis.com/icon?family=Material+Icons"),
  new workbox.strategies.CacheFirst({
    cacheName: "google-fonts-webfont",
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  new RegExp("https://unpkg.com/sweetalert/dist/sweetalert.min.js"),
  new workbox.strategies.CacheFirst({
    cacheName: "sweetalert",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

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
