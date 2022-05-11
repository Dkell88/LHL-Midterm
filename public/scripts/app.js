let POINT_ID = 0;
const addGoogleSearch = (myMap) => {
  const input = document.getElementById("searchBox");
  const searchBox = new google.maps.places.SearchBox(input);

  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    //we can also use .panTo
    myMap.panTo(
      [places[0].geometry.location.lat(), places[0].geometry.location.lng()],
      8
    );
  });
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

  // Posting new map title,lat,long to server
  $("#new-map").click(() => {
    const bounds = map.getBounds();
    const lat = bounds._northEast.lat;
    const lng = bounds._northEast.lng;
    const title = $("#new-map-title").val();
    $.ajax(`/maps`, { method: "POST", data: { lat, lng, title } });
  });

  return map;
};

const map = loadMap();

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

  const setupLayerGroup = function (map) {
    let markerPopupTest = `
      <div>
      <form id="pointForm">
        <textarea name="title" placeholder="Title of the pin?"></textarea><br>
        <textarea name="description" placeholder="Description of the pin?"></textarea><br>
        <textarea name="img-url" placeholder="Image URL"></textarea><br>
        <button class="pin-deets-submit" type="submit">sumbit</button>
        <button class="pin-deets-delete" type="delete">delete</button>
      </form>
    </div>`;
    //marker2.bindPopup(markerPopupTest, { className: "pop-up" }).openPopup();

    const markerLayerGroup = L.layerGroup().addTo(map);
    // markerLayerGroup.addLayer(marker2);
    // console.log("This is the marker layer ", markerLayerGroup)
    const layerNumber = markerLayerGroup.getLayer();
    //console.log("This is the marker layer id", layerNumber)

    var overlay = { markers: markerLayerGroup };
    const options = { position: "bottomleft" };
    L.control.layers(null, overlay, options).addTo(map);

    return markerLayerGroup;
  };

  function onMapClick(event) {
    console.log("onclick");

    let point = {
      mapId: 41,
      leafletId: 8,
      title: "",
      description: "",
      imageURL: "",
      latitude: event.latlng.lat,
      longitude: event.latlng.lng,
    };
    //console.log("Point before modifying the leaflet ID: ", point);
    //console.log("Point before modifying the leaflet ID: ", point.leafletId);

    let markerPopup = `
    <div >
    <form class="pointForm">
    <textarea name="title" placeholder="Title of the pin?"></textarea><br>
    <textarea name="description" placeholder="Description of the pin?"></textarea><br>
    <textarea name="img-url" placeholder="Image URL"></textarea><br>
    <button class="pin-deets-submit" type="submit">sumbit</button>
    </form>
    </div>`;

    //markerLayerGroup.removeFrom(map);

    let marker = new L.marker([point.latitude, point.longitude], {
      bubblingMouseEvents: true,
      // draggable: true
    });
    marker.bindPopup(markerPopup, { className: "pop-up" }).openPopup();
    markerLayerGroup.addLayer(marker);
    // console.log("This is the marker layer ", markerLayer)
    markerLayerGroup.addTo(map);
    markerLayerGroup.addTo(featureGroup);
    featureGroup.addTo(map);
    console.log("featureGroup ", featureGroup);
    //map.addLayer(markerLayer);
    //console.log("This is the map object: ", map);
    //console.log("This is the layergroup object: ", markerLayerGroup);
    //console.log("This is the markers layer ID: ", marker._leaflet_id);
    const num = marker._leaflet_id;
    point.leafletId = num;
    //console.log("Point after changing the leaflet ID: ", point.leafletId);

    $.post("points/", point);
    //.then(pointAdded => {
    //console.log("point added to DB ", pointAdded)
    //console.log("The pointAdded.id is: ",  pointAdded.id)
    //POINT_ID = pointAdded.id;
    //onsole.log("POINT_ID is now: ", POINT_ID)
    //})
    let markerPopupTest = `
           <section class = "pin-popus">
           <span>CAN I REPLACE</span><br>
           <span>THE POP UP?</span><br>
           <img src="http://dummyimage.com/120x100.png/ff4444/ffffff">
           </section>`;

    //marker.bindPopup(markerPopupTest);
    // marker2.setPopupContent(markerPopupTest);
    POINT_ID = num;
    console.log(markerLayerGroup.getLayers());
  }

  $("#map").on("submit", ".pointForm", function (event) {
    event.preventDefault();
    console.log("Sumbitted");
    const kids = $(this).has("textarea");

    const pointToEdit = {
      title: $(kids[0][0]).val(),
      description: $(kids[0][1]).val(),
      imageURL: $(kids[0][2]).val(),
      leafletId: -999,
    };
    console.log(pointToEdit);

    let markerPopupTest = `
      <section class = "pin-popus">
      <span>${pointToEdit.title}</span><br>
      <span>${pointToEdit.description}</span><br>
      <img src="${pointToEdit.imageURL}">
      </section>`;

    let = layerToEdit = -999;
    const layers = markerLayerGroup.getLayers();
    for (const layer of layers) {
      console.log(layer.isPopupOpen());
      if (layer.isPopupOpen()) {
        layerToEdit = layer;
      }
    }
    console.log(layerToEdit._leaflet_id);
    $.get(`points/leaflet/${layerToEdit._leaflet_id}`).then((point) => {
      console.log(point);
      $.post(`/points/${point.id}/edit`, pointToEdit).then((point) => {
        layerToEdit.setPopupContent(markerPopupTest);
        console.log("point returned after GET /points/:id: ", point);
      });
    });
    // $.post('/render', layers)
  });

  // $('#map').on('click', '.leaflet-marker-draggable', function(event) {
  //     console.log("CLick event, hopefully do to drag?", event)
  // });

  const onMapMouseUp = function (event) {
    console.log("this is a mouse up event: ", event);
  };

  renderMap(map);
  const markerLayerGroup = setupLayerGroup(map);
  const featureGroup = L.featureGroup();
  map.on("click", onMapClick);
  map.on("mouseup", onMapMouseUp);

  featureGroup.on("click", function (ev) {
    console.log("marker layer groups has been clicked", ev);
  });

  markerLayerGroup.on("click", function (ev) {
    console.log("marker layer groups has been clicked", ev);
  });
});
