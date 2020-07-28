let dbPromised = idb.open("Premier League", 2, function (upgradeDb) {
  let teamOS = upgradeDb.createObjectStore("teams", {
    keyPath: "id",
  });
  teamOS.createIndex("name", "name", {
    unique: false,
  });
});

function saveFavorite(team) {
  dbPromised
    .then(function (db) {
      let tx = db.transaction("teams", "readwrite");
      let store = tx.objectStore("teams");
      // console.log(team);
      store.put(team);
      return tx.complete;
    })
    .then(function () {
      const title = "Data Team Berhasil disimpan!";
      console.log(title);
      const options = {
        body: `Club ${team.name} berhasil tersimpan, cek Team Favorite.`,
        badge: "../assets/img/icon/icon-72x72.png",
        icon: "../assets/img/icon/icon-72x72.png",

        actions: [
          {
            action: "yes-action",
            title: "Ya",
          },
          {
            action: "no-action",
            title: "Tidak",
          },
        ],
      };
      if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then(function (registration) {
          registration.showNotification(title, options);
        });
      } else {
        M.toast({
          html: `Club ${team.name} berhasil disimpan, cek Team Favorite.`,
          classes: "green",
          displayLength: 2000,
        });
      }
      // location.reload();
    })
    .catch(function () {
      M.toast({
        html: "Club gagal disimpan",
        classes: "red",
        displayLength: 2000,
      });
      // location.reload();
    });
}

function deleteFavorite(team) {
  dbPromised
    .then(function (db) {
      let tx = db.transaction("teams", "readwrite");
      let store = tx.objectStore("teams");
      // console.log(team);
      store.delete(team);
      return tx.complete;
    })
    .then(function () {
      const title = "Data Team Berhasil dihapus!";
      const options = {
        body: `Club berhasil dihapus dari list Favorite.`,
        badge: "../assets/img/icon/icon-72x72.png",
        icon: "../assets/img/icon/icon-72x72.png",
      };
      if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then(function (registration) {
          registration.showNotification(title, options);
        });
      } else {
        M.toast({
          html: `Club berhasil dihapus dari list Favorite.`,
          classes: "red",
          displayLength: 2000,
        });
      }
      // location.replace("/#home");
      location.reload();
    })
    .catch(function () {
      M.toast({
        html: "Club gagal dihapus",
        classes: "red",
        displayLength: 2000,
      });
      location.reload();
    });
}

function checkFavorite(id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        let tx = db.transaction("teams", "readonly");
        let store = tx.objectStore("teams");
        return store.get(id);
      })
      .then(function (favorite) {
        if (favorite !== undefined) {
          resolve(true);
        } else {
          // reject(false);
        }
      });
  });
}

function getAllFavorite() {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        let tx = db.transaction("teams", "readonly");
        let store = tx.objectStore("teams");
        return store.getAll();
      })
      .then(function (teams) {
        // console.log(teams);
        resolve(teams);
      });
  });
}
