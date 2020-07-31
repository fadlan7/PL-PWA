const BASE_URL = "https://api.football-data.org/v2/";
const API_KEY = "f74d753210d644d4ae0b7b1a54d04b4d";
const LEAGUE_ID = "2021";
const STANDINGS = `${BASE_URL}competitions/${LEAGUE_ID}/standings`;
const TEAM = `${BASE_URL}teams/`;
// const TOPSKOR = `${BASE_URL}competitions/${LEAGUE_ID}/scorers`;

let convertDate = (date) => {
  const namaBulan = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${date.getDate()} ${
    namaBulan[date.getMonth()]
  } ${date.getFullYear()} ${formatAMPM(date)}`;
};

function formatAMPM(date) {
  let jam = date.getHours();
  let menit = date.getMinutes();
  let ampm = jam >= 12 ? "PM" : "AM";
  jam = jam % 12;
  jam = jam ? jam : 12;
  menit = menit < 10 ? "0" + menit : menit;
  let strTime = jam + ":" + menit + " " + ampm;
  return strTime;
}

let fetchApi = (url) => {
  return fetch(url, {
    headers: {
      "X-Auth-Token": API_KEY,
    },
  });
};

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error :" + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array javascript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-jandle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promis.reject()
  console.log("Error : " + error);
}

function getKlasemen() {
  if ("caches" in window) {
    caches.match(STANDINGS).then((response) => {
      if (response) {
        response.json().then((data) => {
          showKlasemen(data);
        });
      }
    });
  }

  fetchApi(STANDINGS)
    .then(status)
    .then(json)
    .then((data) => {
      showKlasemen(data);
    })
    .catch(error);
}

function getTeam() {
  return new Promise((resolve, reject) => {
    // Ambil nilai query parameter (?id=)
    let urlParams = new URLSearchParams(window.location.search);
    let idParams = urlParams.get("id");

    if ("caches" in window) {
      caches.match(TEAM + idParams).then((response) => {
        if (response) {
          response.json().then((data) => {
            showTeam(data);
            resolve(data);
          });
        }
      });
    }

    fetchApi(TEAM + idParams)
      .then(status)
      .then(json)
      .then((data) => {
        showTeam(data);
        resolve(data);
      });
  });
}

function getMatch() {
  // Ambil nilai query parameter (?id=)
  let urlParams = new URLSearchParams(window.location.search);
  let idParams = urlParams.get("id");

  if ("caches" in window) {
    caches.match(TEAM + idParams + "/matches?").then((response) => {
      if (response) {
        response.json().then((data) => {
          showMatch(data);
        });
      }
    });
  }

  fetchApi(TEAM + idParams + "/matches?")
    .then(status)
    .then(json)
    .then((data) => {
      showMatch(data);
    });
}

function getAbout() {
  if ("caches" in window) {
    caches.match(STANDINGS).then((response) => {
      if (response) {
        response.json().then(() => {
          showAbout();
        });
      }
    });
  }

  fetchApi(STANDINGS)
    .then(status)
    .then(json)
    .then(() => {
      showAbout();
    })
    .catch(error);
}

function showKlasemen(data) {
  let klasemenHTML = "";
  data.standings[0].table.forEach((standing) => {
    let logoTeam = standing.team.crestUrl;

    klasemenHTML += `
    <tr>
      <td>${standing.position}</td>
      <td>
        <a href="./pages/detail-team.html?id=${standing.team.id}">
          <img src="${logoTeam}" width="40px" alt="badge" alt="${standing.team.name}" onerror="this.src='../img/icon/error.png'"/>
        </a>
      </td>
      <td>
        <a href="./pages/detail-team.html?id=${standing.team.id}">
          <span">${standing.team.name}</span>
        </a>
      </td>
      <td>${standing.playedGames}</td>
      <td>${standing.won}</td>
      <td>${standing.draw}</td>
      <td>${standing.lost}</td>
      <td>${standing.goalsFor}</td>
      <td>${standing.goalsAgainst}</td>
      <td>${standing.goalDifference}</td>
      <td style="font-weight: bold">${standing.points}</td>
    </tr>
    `;
  });
  // Sisipkan komponen ke dalam elemen table dengan id #klasemen
  document.getElementById("klasemen").innerHTML = klasemenHTML;
}

function showTeam(data) {
  let squads = "";
  let info = "";
  let overviewTeamHTML = document.getElementById("overview");
  let logoTeam = data.crestUrl;

  info += `
  <div class="container">
            <div class="card" style="text-align:center;">
                <div class="row">
                <div class="col s3 l5"></div>
                  <div class="col s6 l2" style="margin-bottom: 0; padding:0; ">
                      <img src="${logoTeam}" onerror="this.src='../img/icon/error.png'" alt="${data.name}" style="padding-top: 2rem; width:100%; height: auto;" align="middle" >
                      <span class="card-title" style="font-weight: bold">${data.name}</span>
                  </div>
                </div>
                <div class="card-content" style="margin-top: 0;padding:20px; overflow: auto;">
                  <table>
                    <tbody>
                      <tr>
                        <th>Founded</th>
                        <td>${data.founded}</td>
                      </tr>
                      <tr>
                        <th>Address</th>
                        <td>${data.address}</td>
                      </tr>
                      <tr>
                        <th>Website</th>
                        <td><a href="${data.website}" target="_blank">${data.website}</a></td>
                      </tr>
                      <tr>
                        <th>Email</th>
                        <td>${data.email}</td>
                      </tr>
                      <tr>
                        <th>Club Color</th>
                        <td>${data.clubColors}</td>
                      </tr>
                      <tr>
                        <th>Stadium</th>
                        <td>${data.venue}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                </div>
              </div>
        `;

  data.squad.forEach(function (member) {
    if (member.role === "PLAYER") {
      squads += `
            <tr style="text-align: center;">
                <td>
                  <span style="color: blue; ">${member.name} (${member.shirtNumber})</span> <br />
                  <span style="font-weight: bold"> From:  </span> ${member.nationality}
                </td>
                <td>${member.position}</td>
            </tr>
    `;
    }
  });

  data.squad.forEach(function (member) {
    if (member.role !== "PLAYER") {
      squads += `
            <tr style="text-align: center;">
                <td>
                  <span style="color: blue; ">${member.name}</span> <br />
                  <span style="font-weight: bold"> From:  </span> ${member.nationality}
                </td>
                <td>${member.role}</td>
            </tr>
            `;
    }
  });

  overviewTeamHTML.innerHTML = `
            ${info}
            <div class="container">
            <div class="card col s12 m12" style="padding:0">
              <h5 class="collection-header" style="text-align: center; padding:20px 0; margin:0; color: white; background-color: #412552"><strong>Team Member</strong></h5>
              <div class="card-content" style="margin-top: 0;padding:20px; overflow: auto;">
                <table>
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Position</th>
                      </tr>
                  </thead>
                  <tbody>
                    ${squads}
                  </tbody>
                </table>
              </div>
            </div>
            </div>
        `;
}

function showMatch(data) {
  let matchHTML = "";

  data.matches.forEach((match) => {
    if (match.competition.name === "Premier League") {
      // let logoHome = match.homeTeam.crestUrl.replace(/^http:\/\//i, "https://"); ${match.goals.scorer.name}
      //let logoAway = match.awayTeam.crestUrl.replace(/^http:\/\//i, "https://");
      const scoreHome = match.score.fullTime.homeTeam == null ? "-" : match.score.fullTime.homeTeam;
      const scoreAway = match.score.fullTime.awayTeam == null ? "-" : match.score.fullTime.awayTeam;
      const matchStatus = match.status.toLowerCase();

      matchHTML += `
      <div class="container">
      <row>
        <div class="card col s12 m12 l6" style="overflow: auto">
                <div class="card-content pt-0" style="display: flex;">
                    <div class="column" style="flex: 1;align-self: center; text-align: center;">
                        <a href="detail-team.html?id=${match.awayTeam.id}" class="team-name" style="font-size: 15px;">${match.homeTeam.name}</a>
                    </div>

                    <div class="column" style="flex: 1;align-self: center; text-align: center;">
                        <div class="match-info" style="display: grid;">
                            <span class="match-arena" style="font-size: 12px; color: #676767;">Match Day ${match.matchday}</span>
                            <span class="match-date" style="font-size: 12px; color: #676767;">${convertDate(new Date(match.utcDate))}</span>
                            <span class="match-score" style="font-size: 18px; font-weight: bold;">${scoreHome} : ${scoreAway}</span>
                            <span class="match-arena" style="font-size: 12px; color: #676767;"><span style="font-weight:bold">Match Status:</span> ${matchStatus} </span>
                        </div>
                    </div>

                    <div class="column" style="flex: 1;align-self: center; text-align: center;">
                        <a href="detail-team.html?id=${match.awayTeam.id}" class="team-name" style="font-size: 15px;">${match.awayTeam.name}</a>
                    </div>
                </div>
            </div>
      </row>
      </div>
    `;
    }
  });
  // Sisipkan komponen players ke dalam elemen matches
  document.getElementById("matches").innerHTML = matchHTML;
}

function getSavedFavorite() {
  getAllFavorite().then((teams) => {
    let favHTML = ` `;

    if (teams.length == 0)
      favHTML += `<div class="center">kamu belum mempunyai team favorit</div>`;

    teams.forEach((team) => {
      let logoTeam = team.crestUrl;

      favHTML += `
          <tr>
          <td>
            <img src="${logoTeam}" width="70px" onerror="this.src='../img/icon/error.png'" alt="${team.name}">
          </td>
          <td>${team.name}</td>
          <td class="center">
            <button class="waves-effect waves-light btn"><a class="white-text" href="./pages/detail-team.html?id=${team.id}"><i class="material-icons">remove_red_eye</i></a></button>
            <button  onclick="deleteOnClick(${team.id})" class="waves-effect waves-light btn pink buttonHapus"><i class="material-icons">clear</i></button>
          </td>
          </tr>
      `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #team-favorite
    document.getElementById("team-favorite").innerHTML = favHTML;
  });
}

function showAbout() {
  let  aboutHTML = `
      <div class="card col s12 center" style="overflow: auto; min-height: 450px;">
        <h4>About Me</h4>
        <p>Fadlan Sayyidul Anam</p>
      </div>
    `;
  // Sisipkan komponen card ke dalam elemen dengan id #content
  document.getElementById("about").innerHTML = aboutHTML;
}

let deleteOnClick = (team) => {
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
      deleteFavorite(team);
    } else {
      swal("Club tidak jadi dihapus dari daftar favorit!");
    }
  });
};