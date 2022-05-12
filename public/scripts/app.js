let POINT_ID = 0;

const addGoogleSearch = (myMap) => {
  const input = document.getElementById("searchBox");
  const searchBox = new google.maps.places.SearchBox(input);

  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();
    const searchLat = places[0].geometry.location.lat();
    const searchLng = places[0].geometry.location.lng();

    console.log(input.value);
    //we can also use .panTo
    myMap.panTo([searchLat, searchLng], 8);
    let marker = new L.marker([searchLat, searchLng], {
      //bubblingMouseEvents: true,
      title: input.value,
    });
    marker.bindPopup(markerPopup).openPopup();
    markerLayerGroup.addLayer(marker);
    markerLayerGroup.addTo(map);
  });
};

const setupLayerGroup = function (map) {
  const markerLayerGroup = L.layerGroup().addTo(map);
  const overlay = { markers: markerLayerGroup };
  const options = { position: "bottomleft" };
  L.control.layers(null, overlay, options).addTo(map);

  return markerLayerGroup;
};
const getCurrentUserLocation = (map) => {
  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    map.setView([latitude, longitude], 15);
  });
  $.get("/home");
};

const loadMap = function () {
  const map = L.map("map", {
    doubleClickZoom: false,
    bubblingMouseEvents: true,
    zoomControl: false,
  }).setView([49.262838, -122.781071], 16);

  L.control
    .scale({
      metric: true,
      imperial: false,
      position: "bottomright",
    })
    .addTo(map);
  L.control
    .zoom({
      position: "bottomright",
    })
    .addTo(map);

  addGoogleSearch(map);
  getCurrentUserLocation(map);
  // Posting new map title,lat,long to server
  $(".heart").css("visibility", "hidden");
  $("#new-map").click(() => {
    const bounds = map.getBounds();
    const lat = bounds._northEast.lat;
    const lng = bounds._northEast.lng;
    const title = $("#new-map-title").val();
    $.ajax(`/maps`, {
      method: "POST",
      data: { lat, lng, title },
      success: (data) => {
        console.log("data", data);
        loadContri(1); //remove this!!!
        showTitleAndIcons(true)
        // $(".map-title").text(data.title).show();
        // $(".heart").css("visibility", "visible");
        // $("#save-map").hide();
        // $("#new-map-title").val("");
      },
    });
    $("#create").click(() => {
      markerLayerGroup.clearLayers();
      getCurrentUserLocation(map);
      showTitleAndIcons(false)
      // $(".map-title").hide();
      // $(".heart").css("visibility", "hidden");
      // $("#save-map").show();
    });
  });

  return map;
};

const map = loadMap();
const markerLayerGroup = setupLayerGroup(map);
const Gmap = new google.maps.Map(document.getElementById("Gmap"));
service = new google.maps.places.PlacesService(Gmap);

$(() => {
  const renderMap = function (map) {
    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          "pk.eyJ1IjoiZGtlbGw4OCIsImEiOiJjbDJ3Zm44NjMwZjVqM2RxY3gyN3J6dXJ2In0.SYE3QdtfFxH63YvUTI7FMA",
      }
    ).addTo(map);

    //console.log("This is the map object: ", map)
  };

  const getPopupID = function () {
    const layers = markerLayerGroup.getLayers();
    for (const layer of layers) {
      if (layer.isPopupOpen()) {
        return layer;
      }
    }
    return false;
  };

  function onMapClick(event) {
    let point = {
      mapId: -999, //Set by cookies when POST call is make
      leafletId: -999, //Set after POST is made and marker is creted.
      title: "",
      description: "",
      image_url: "",
      latitude: event.latlng.lat,
      longitude: event.latlng.lng,
    };
    let imagePlaceHolder = "Image URL";

    //------------------------------------------------------------------------------------------------------------
    const geocoder = new google.maps.Geocoder();

    latitude = event.latlng.lat;
    longitude = event.latlng.lng;
    const latlng = { lat: parseFloat(latitude), lng: parseFloat(longitude) };

    placeIDToUse = "";

    geocoder
      .geocode({ location: latlng }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            console.log(results[1].place_id);
            placeIDToUse = results[1].place_id;
          } else {
            console.log("No results found");
          }
        } else {
          console.log("Geocoder failed due to: " + status);
        }
      })
      .then(() => {
        const request = {
          placeId: placeIDToUse,
          fields: [
            "name",
            "formatted_address",
            "place_id",
            "geometry",
            "photos",
          ],
        };

        service.getDetails(request, callback);

        function callback(place, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            if (place.photos) {
              console.log("There are photos!!!");
              const photourl = place.photos[0].getUrl();
              tempstring = `${photourl}`;
              point.image_url = tempstring;
              imagePlaceHolder = "Image found by GOOGLE!!!";
            }
          }
          //*********************************************************************** */
          $.post("points/", point).then((pointPosted) => {
            let marker = new L.marker(
              [pointPosted.latitude, pointPosted.longitude],
              {
                //bubblingMouseEvents: true,
                title: pointPosted.id,
              }
            );

            let markerPopup = `
                      <div >
                        <form class="pointForm">
                          <textarea name="title" placeholder="Title of the pin?"></textarea><br>
                          <textarea name="description" placeholder="Description of the pin?"></textarea><br>
                          <textarea name="img-url" placeholder="${imagePlaceHolder}"></textarea><br>
                          <div>
                            <button class="pin-deets-submit" type="submit">sumbit</button>
                            <button class="pin-deets-delete">delete</button>
                          </div>
                        </form>
                      </div>`;

            marker.bindPopup(markerPopup).openPopup();
            markerLayerGroup.addLayer(marker);
            markerLayerGroup.addTo(map);

            const num = marker._leaflet_id;
            pointPosted.leafletId = num;

            $.post(`/points/${pointPosted.id}/edit`, pointPosted);
          });
          //*********************************************************************** */
        }
      });
  }

  $("#map").on("submit", ".pointForm", function (event) {
    event.preventDefault();

    const kids = $(this).has("textarea");
    const pointToEdit = {
      title: $(kids[0][0]).val(),
      description: $(kids[0][1]).val(),
      image_url: $(kids[0][2]).val(),
      leafletId: -999,
    };

    layerToEdit = getPopupID();
    pointIdToEdit = layerToEdit.options.title;

    $.get(`points/${pointIdToEdit}`).then((point) => {
      console.log("Get request after submit returend: ", point);
      if (!pointToEdit.image_url) {
        console.log("no url found using existing: ", point.image_url);
        pointToEdit.image_url = point.image_url;
      }
      $.post(`/points/${point.id}/edit`, pointToEdit).then((point) => {
        let markerPopupDetails = `
                <section class = "pin-popus">
                <span>${pointToEdit.title}</span><br>
                <span>${pointToEdit.description}</span><br>
                  <img class = "popup-imgage" src = ${pointToEdit.image_url}>
                  <div>
                  <button class="pin-deets-edit">Edit</button>
                  <button class="pin-deets-delete">Delete</button>
                  </div>
                  </section>`;
        layerToEdit.setPopupContent(markerPopupDetails);
      });
    });
  });

  $("#map").on("click", ".pin-deets-delete", function (event) {
    event.preventDefault();

    layerToDelete = getPopupID();
    pointIdToDelete = layerToDelete.options.title;

    $.post(`/points/${pointIdToDelete}/delete`)
      .then(() => {
        layerToDelete.remove();
        layerToDelete.remove(markerLayerGroup);
      })
      .catch((e) => {
        console.log(e.responseJSON);
      });
  });

  $("#map").on("click", ".pin-deets-edit", function (event) {
    event.preventDefault();

    let markerPopupAppend = `
        <div >
          <form class="pointForm">
            <textarea name="title" placeholder="Title of the pin?"></textarea><br>
            <textarea name="description" placeholder="Description of the pin?"></textarea><br>
            <textarea name="img-url" placeholder="Image url"></textarea><br>
            <div>
              <button class="pin-deets-confirm" >confirm</button>
              <button class="pin-deets-cancel">cancel</button>
            </div>
          </form>
        </div>`;

    layerToAppend = getPopupID();
    layerToAppend.setPopupContent(markerPopupAppend);
  });

  $("#map").on("click", ".pin-deets-confirm", function (event) {
    event.preventDefault();

    const kids = $(this).parent().parent().has("textarea");
    const pointToEdit = {
      title: $(kids[0][0]).val(),
      description: $(kids[0][1]).val(),
      image_url: $(kids[0][2]).val(),
      leafletId: -999,
    };

    if (
      !pointToEdit.title &&
      !pointToEdit.description &&
      !pointToEdit.image_url
    ) {
      console.log("Nothing entered");
      return (sibling = $(this).siblings(".pin-deets-cancel").trigger("click"));
    }
    //Need to start making functions to clean up, if nothing is returned then cancele

    layerToEdit = getPopupID();
    pointIdToEdit = layerToEdit.options.title;

    $.get(`points/${pointIdToEdit}`).then((point) => {
      if (!pointToEdit.title) pointToEdit.title = point.title;
      if (!pointToEdit.description) pointToEdit.description = point.description;
      if (!pointToEdit.image_url) pointToEdit.image_url = point.image_url;
      let markerPopupDetails = `
        <section class = "pin-popus">
          <span>${pointToEdit.title}</span><br>
          <span>${pointToEdit.description}</span><br>
          <img class = "popup-imgage" src="${pointToEdit.image_url}">
          <div>
            <button class="pin-deets-edit">Edit</button>
            <button class="pin-deets-delete">Delete</button>
          </div>
        </section>`;
      pointToEdit.leafletId = point.leafletId;
      $.post(`/points/${point.id}/edit`, pointToEdit).then((point) => {
        layerToEdit.setPopupContent(markerPopupDetails);
      });
    });
  });

  $("#map").on("click", ".pin-deets-cancel", function (event) {
    event.preventDefault();
    console.log("cancel clicked");
    layerToRestore = getPopupID();
    pointIdToRestore = layerToRestore.options.title;

    $.get(`/points/${pointIdToRestore}`).then((point) => {
      let markerPopupDetails = `
          <section class = "pin-popus">
            <span>${point.title}</span><br>
            <span>${point.description}</span><br>
            <img class = "popup-imgage" src="${point.image_url}">
            <div>
            <button class="pin-deets-edit">Edit</button>
              <button class="pin-deets-delete">Delete</button>
            </div>
          </section>`;
      layerToRestore.setPopupContent(markerPopupDetails);
    });
  });

  renderMap(map);

  map.on("click", onMapClick);
});
