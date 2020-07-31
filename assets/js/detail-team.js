document.addEventListener("DOMContentLoaded", () => {
  var elems = document.querySelectorAll(".tabs");
  M.Tabs.init(elems);

  var item = getTeam();
  getMatch();

  let urlParams = new URLSearchParams(window.location.search);
  let id = Number(urlParams.get("id"));
  // checkFavorite(id);

  var save = document.getElementById("save");
  var del = document.getElementById("delete");
  checkFavorite(id)
    .then((msg) => {
      console.log(msg);
      save.style.display = "none";
      del.style.display = "block";
    })
    .catch((msg) => {
      console.log(msg);
      save.style.display = "block";
      del.style.display = "none";
    });

  save.onclick = function () {
    console.log("Tombol save di klik.");
    item.then(function (team) {
      saveFavorite(team);
    });
    save.style.display = "none";
    del.style.display = "block";
  };

  del.onclick = function () {
    console.log("Tombol delete di klik.");
    swal({
      title: "Are you sure?",
      // text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // swal("Club berhasil dihapus dari daftar favorit!", {
        //   icon: "success",
        // });
        deleteFavorite(id);
        del.style.display = "none";
        save.style.display = "block";
      } else {
        swal("Club tidak jadi dihapus dari daftar favorit!");
      }
    });
  };
});
