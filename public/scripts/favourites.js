const createFavElement = (data) => {
  const $fav = `
  <li class="show-map ">
  <a onclick= renderContriMap(${data.map_id})><h3>${data.title}</h3></a>
  </li>`;
  return $fav;
};

const renderFav = function (favs) {
  $(".favs").empty();
  for (const fav of favs.users) {
    $(".favs").prepend(createFavElement(fav));
  }
};

const renderContriMap = (mapId) => {
  $.ajax(`/maps/${mapId}`, { method: "GET" }).then((data) => {
    map.panTo(new L.LatLng(data.latitude, data.longitude));
    $(".map-title").text(data.title).show();
    $(".heart").css("visibility", "visible");
    $("#save-map").hide();
    $("#new-map-title").val("");
  });
  $.ajax(`points/maps/${mapId}`, { method: "GET" }).then((data) => {
    console.log("ajax call", data);
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

const loadContri = (id) => {
  $.ajax({
    type: "GET",
    url: `/users/contri/${id}`,
    success: (response) => {
      console.log("fron users/id", response);
      renderContri(response);
    },
  });
};

const loadFav = (id) => {
  $.ajax({
    type: "GET",
    url: `/users/favs/${id}`,
    success: (response) => {
      renderFav(response);
    },
  });
};

$(() => {
  const userId = 1;
  if (userId) {
    loadContri(userId);
    loadFav(userId);
  }
});
