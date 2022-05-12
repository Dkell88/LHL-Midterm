
const showTitleAndIcons = (command, title) => {
  if(command){
    $(".map-title").text(title).show();
    $(".heart").css("visibility", "visible");
    $("#save-map").hide();
    $("#new-map-title").val("");
    return
  }
  $(".map-title").text();
  $(".map-title").hide();
  $(".heart").css("visibility", "hidden");
  $("#save-map").show();
}

const renderList = (data) => {
  const $li = `
  <li class="show-map">
  <a onclick= renderContriMap(${data.id})><h3>${data.title}</h3></a>
  </li>`;
  return $li;
};

const populateList = function (data, targetClass) {
  $(targetClass).empty();
  for (const item of data) {
    $(targetClass).prepend(renderList(item));
  }
};

const renderContriMap = (mapId) => {
  $.get(`/maps/${mapId}`)
  .then((MapToLoad) => {
    map.panTo(new L.LatLng(MapToLoad.latitude, MapToLoad.longitude));
    showTitleAndIcons(true, MapToLoad.title)

  });
  $.get(`points/maps/${mapId}`)
    .then((points) => {
      if (points) {
        for (const point of points) {
          //Add points to map !!!!!!!!!!!!!!!!!!!!!!!
          L.marker([point.latitude, point.longitude]).addTo(map);
        }
      }
    });
};

const loadContri = (id) => {
  $.get(`/users/contri/${id}`)
    .then( contirbutions => {
      populateList(contirbutions, '.contri');
    });
};

const loadFav = (id) => {
  $.get(`/users/favs/${id}`)
    .then(favourites => {
      populateList(favourites, '.favs');
    });
};




$(() => {
  const userId = 1;  //Change to $.get('users/') if we are using user login
  if (userId) {
    loadContri(userId);
    loadFav(userId);
  }

  $(".heart").on('click', () => {
    console.log("heart clicked")
    $.post("/users/fav");
    $(".heart").toggleClass("saved");
    loadFav(1);
  });

});