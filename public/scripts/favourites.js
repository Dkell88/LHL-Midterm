//heart function

//favourites
const createFavElement = (data) => {
  const $fav = `<li class="show-map ">
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
  $.ajax(`points/maps/${mapId}`, { method: "GET" }).then((data) => {
    if (data && mapId) {
      for (const point of data) {
        L.marker([point.latitude, point.longitude]).addTo(map);
      }
    }
  });
};

//contirbutions
const createContribution = (data) => {
  const $fav = `
  <li class="show-map">
  <a onclick= renderContriMap(${data.id})><h3>${data.title}</h3></a>
  </li>`;
  return $fav;
};

const addMap = (map) => {
  $(".contri").prepend(createContribution(map));
};

const renderContri = function (data) {
  $(".contri").empty();
  data.users.forEach(addMap);
};

const loadFav = (id) => {
  $.ajax({
    type: "GET",
    url: `/users/${id}`,
    success: (response) => {
      console.log("fron users/id", response);
      renderContri(response);
    },
  });
};

$(() => {
  // load jquery before you do this
  // get the user data using the cookies = userId = 1
  const userId = 15; // change it cookies after login impl
  // if the user is logged then load his fav's
  if (userId) {
    loadFav(userId);
  }
});
