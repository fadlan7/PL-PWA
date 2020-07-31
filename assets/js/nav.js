document.addEventListener("DOMContentLoaded", () => {
  let elems = document.querySelectorAll(".bottom-nav");
  M.Sidenav.init(elems);
  loadNav();

  function loadNav() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status !== 200) return;

        // Muat daftar tautan menu
        document.querySelectorAll(".topnav, .bottom-nav").forEach((elm) => {
          elm.innerHTML = xhttp.responseText;
        });

        // Daftarkan event listener untuk setiap tautan menu
        document.querySelectorAll(".topnav a, .bottom-nav a").forEach((elm) => {
          elm.addEventListener("click", (event) => {
            // Tutup sidenav
            let sidenav = document.querySelector(".bottom-nav");
            M.Sidenav.getInstance(sidenav).close();

            // Muat konten halaman yang dipanggil
            // page = event.target.getAttribute("href").substr(1);
            // loadPage(page);

            if(event.target.getAttribute("href")===null){
              page = event.currentTarget.getAttribute("href").substr(1);
              loadPage(page)
            }else{
              page = event.target.getAttribute("href").substr(1);
              loadPage(page);
            }
          });
        });
      }
    };
    xhttp.open("GET", "nav.html", true);
    xhttp.send();
  }

  // Load page content
  let page = window.location.hash.substr(1);
  if (page === "") page = "home";
  loadPage(page);

  function loadPage(page) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        let content = document.querySelector("#body-content");

        if (page === "home") {
          getKlasemen();
        } else if (page === "team-favorite") {
          getSavedFavorite();
        } else if (page==="about"){
          getAbout();
        } else {
          getKlasemen();
        }

        if (this.status === 200) {
          content.innerHTML = xhttp.responseText;
        } else if ((this.status === 404)) {
          content.innerHTML = "<p class='center'>Halaman Tidak Ditemukan</p>";
        } else {
          content.innerHTML =
            "<p class='center'>Ups... halaman tidak dapat diakses.</p>";
        }
      }
    };
    xhttp.open("GET", "pages/" + page + ".html", true);
    xhttp.send();
  }
});
