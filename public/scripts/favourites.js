
const showTitleAndIcons = (command) => {
  if(command){
    $(".map-title").text(MapToLoad.title).show();
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
    showTitleAndIcons(true)

  });
  $.get(`points/maps/${mapId}`)
    .then((points) => {
      console.log("ajax call", points);
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
});


// const createFavElement = (data) => {
//   const $fav = `
//   <li class="show-map ">
//   <a onclick= renderContriMap(${data.map_id})><h3>${data.title}</h3></a>
//   </li>`;
//   return $fav;
// };
// //contirbutions
// const createContribution = (data) => {
//   const $fav = `
//   <li class="show-map">
//   <a onclick= renderContriMap(${data.id})><h3>${data.title}</h3></a>
//   </li>`;
//   return $fav;
// };
//
// const renderFav = function (favs) {
//   $(".favs").empty();
//   for (const fav of favs) {
//     $(".favs").prepend(createFavElement(fav));
//   }
// };
// const renderContri = function (data) {
//   $(".contri").empty();
//   data.forEach(addMap);
// };


// const addMap = (element) => {
//   $(".contri").prepend(createContribution(element));
// };