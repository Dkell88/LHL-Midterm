
const showTitleAndIcons = (command, title) => {
  if(command){
    $(".map-title").text(title).show();
    $("#save-map").hide();
    $("#new-map-title").val("");
    //if($("#login").is(":visibile")){
       $(".heart").css("visibility", "visible");
    //}
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
  <a onclick= renderMapId(${data.id})><h3>${data.title}</h3></a>
  </li>`;
  return $li;
};

const populateList = function (data, targetClass) {
  $(targetClass).empty();
  for (const item of data) {
    $(targetClass).prepend(renderList(item));
  }
};

const renderMapId = (mapId) => {
  $.get(`/maps/${mapId}`)
  .then((MapToLoad) => {
    map.panTo(new L.LatLng(MapToLoad.latitude, MapToLoad.longitude));
    showTitleAndIcons(true, MapToLoad.title)

  });
  $.get(`points/maps/${mapId}`)
    .then((points) => {
      markerLayerGroup.clearLayers();
      if (points) {
        for (const point of points) {
          let marker = new L.marker([point.latitude, point.longitude],{title: point.id,});
          let markerPopupDetails = `
          <section class = "pin-popus">
          <span>${point.title}</span><br>
          <span>${point.description}</span><br>
            <img class = "popup-imgage" src = ${point.image_url}>
            <div>
            <button class="pin-deets-edit">Edit</button>
            <button class="pin-deets-delete">Delete</button>
            </div>
            </section>`;
          marker.bindPopup(markerPopupDetails).openPopup();
          markerLayerGroup.addLayer(marker);
        }
        markerLayerGroup.addTo(map);
      }
    });
    $.get(`/users/favs/1`) //Change to $.get('users/') if we are using user login
    .then(favourites => {
      favourites.shift()
      for(const fav of favourites) {
        if (fav.id === mapId) {
          return $(".heart").addClass("saved");
        }
      }
      $(".heart").removeClass("saved");
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
      favourites.shift()
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
      $.get("/users/favs/1")  //Change to $.get('users/') if we are using user login
        .then((favs) => {
          const cookie = favs.slice(0,1);
          favs.shift()
          for(const fav of favs) {
            if (fav.id == cookie[0].id) {
              $.post(`/users/fav/delete/${fav.id}` )
              .then(()=> {
                $(".heart").removeClass("saved");
                loadFav(1);  //Change to $.get('users/') if we are using user login
              }); 
              return
            }
          }
          $.post("/users/fav")
          .then(()=> {
            $(".heart").addClass("saved");
            loadFav(1);  //Change to $.get('users/') if we are using user login
          }); 
        }) 
    });
});