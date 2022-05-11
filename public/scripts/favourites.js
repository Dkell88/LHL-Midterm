//favourites
const createFavElement = (data) => {
  const $fav = `<li class="show-map">
  <a><h3>${data.title}</h3></a>
  </li>`;
  return $fav;
};

const renderFav = function (favs) {
  for (const fav of favs.users) {
    $(".favs").prepend(createFavElement(fav));
  }
};

const renderContriMap = (mapId) => {
  $.ajax(`/maps/${mapId}`, { method: "GET" }).then((data) => {
    map.panTo(new L.LatLng(data.latitude, data.longitude));
  });

  // $.ajax(`/maps/points/${mapId}`, { method: "GET" }).then((data) => {
  //   const testMarker = L.marker([data.latitude, data.longitude]).addTo(map);
  // });
};

//contirbutions
const createContribution = (data) => {
  const $fav = `
  <li class="show-map">
  <a onclick= renderContriMap(${data.id})><h3>${data.title}</h3></a>
  </li>`;
  return $fav;
};

const renderContri = function (data) {
  for (const contri of data.users) {
    // console.log(contri);
    $(".contri").prepend(createContribution(contri));
  }
};

/*
1. login screen => store data as cookies or local storage

2. Home Screen / Favourites screen =>
    a. get the user data
    b. load the favourite maps of the user
    c. render the maps


3. Clicking maps points
4. Manipulating points
5. other routes => cotributions, account settings
*/

const loadFav = (id) => {
  $.ajax({
    type: "GET",
    url: `/users/${id}`,
    success: (response) => {
      // { users }
      // renderFav(response);
      renderContri(response);
    },
  });
  // $.ajax({
  //   type: "GET",
  //   url: `/users/contri/${id}`,
  //   success: (response) => {
  //     // { users }
  //     console.log(response);
  //     renderContri(response);
  //   },
  // });
};

$(() => {
  // load jquery before you do this
  // get the user data using the cookies = userId = 1
  const userId = 1; // change it cookies after login impl
  // if the user is logged then load his fav's
  if (userId) {
    loadFav(userId);
  }
});
