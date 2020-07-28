// Periksa service worker
if (!("serviceWorker" in navigator)) {
  console.log("Service worker tidak didukung di browser ini.");
} else {
  registerServiceWorker();
  requestPermission();
}

// Register service worker
function registerServiceWorker() {
  return navigator.serviceWorker
    .register("/sw-workbox.js")
    .then(function (registration) {
      console.log("Registrasi service worker berhasil");
      return registration;
    })
    .catch(function (err) {
      console.log("Registrasi service worker gagal.", err);
    });
}

// Request Permission
function requestPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(function (result) {
      if (result === "denied") {
        console.log("Fitur notifikasi tidak diijinkan");
        return;
      } else if (result === "default") {
        console.error("Pengguna menutup kotak dialog permintaan ijin.");
        return;
      }
      if (('PushManager' in window)) {
        navigator.serviceWorker.getRegistration().then(function(registration) {
          // reg.showNotification('Notifikasi diijinkan!');
          registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array("BI0j2mMawOoMyf6kRm4b-6Kr1PzHJrPKrqqjwFGqWoK8s_9W6vCVHAST_efS4oJojplZ1mL7WtAqm9qwknf_Nnk")
          }).then(function(subscribe) {
            console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
            console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
              null, new Uint8Array(subscribe.getKey('p256dh')))));
            console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
              null, new Uint8Array(subscribe.getKey('auth')))));
          }).catch(function(e) {
            console.error('Tidak dapat melakukan subscribe ', e.message);
          });
        });
      }
    });
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}