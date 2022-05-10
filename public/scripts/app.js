let POINT_ID = 0;

$(() => {
  getCurrentUserLocation();
});

const getCurrentUserLocation = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    return renderMap(latitude, longitude);
  });
};

const renderMap = function (lat, long) {
  const map = L.map("map", {
    doubleClickZoom: false,
  }).setView([lat, long], 16);

  const mapTiles = {
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoiZ2FnYW5zaW5naDMiLCJhIjoiY2wyd2RqY3l2MDg2NjNjcXU5cDNoaHJmbyJ9.WaGj9j3kU-EKhz0-tQSD6w",
  };

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    mapTiles
  ).addTo(map);
  addGoogleSearch(map);

  L.control
    .scale({
      metric: true,
      imperial: false,
      position: "bottomright",
    })
    .addTo(map);
};

const addGoogleSearch = (myMap) => {
  const GooglePlacesSearchBox = L.Control.extend({
    onAdd: function () {
      const element = document.createElement("input");
      element.id = "searchBox";
      return element;
    },
  });
  new GooglePlacesSearchBox().addTo(myMap);

  const input = document.getElementById("searchBox");
  const searchBox = new google.maps.places.SearchBox(input);

  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    //we can also use .panTo
    myMap.flyTo(
      [places[0].geometry.location.lat(), places[0].geometry.location.lng()],
      8
    );
  });
};
// const map = loadMap();
// renderMap(map);

function onMapClick(event) {
  if ($("#pin-deets").is(":visible")) {
    console.log("yes pin deeets is visible");
  }
  if (!$("#pin-deets").is(":visible")) {
    console.log("Nope pin deeets isn't visible");
    $("#pin-deets").show();

    const point = {
      mapId: 41,
      title: "",
      description: "",
      imageURL: "",
      latitude: event.latlng.lat,
      longitude: event.latlng.lng,
    };
    // console.log(event.latlng);
    // console.log(point);

    //addPoint(point);

    $.post("points/", point).then((pointAdded) => {
      console.log("point added to DB ", pointAdded);
      console.log("The pointAdded.id is: ", pointAdded.id);
      POINT_ID = pointAdded.id;
      console.log("POINT_ID is now: ", POINT_ID);
    });
    //$.get('/points/');
  }
}

$("#pin-deets").submit(function (event) {
  console.log("Sumbitted");
  event.preventDefault();
  const kids = $(this).children();
  const pointToEdit = {
    title: $(kids[0]).val(),
    description: $(kids[1]).val(),
    imageURL: $(kids[2]).val(),
  };

  if (!pointToEdit.title || !pointToEdit.description || !pointToEdit.imageURL) {
    return console.log("error missing a title, description, or image URL");
  }

  let markerPopup = `
      <section class = "pin-popus">
      <span>${pointToEdit.title}</span><br>
      <span>${pointToEdit.description}</span><br>
      <img src="${pointToEdit.imageURL}">
      </section>`;
  //console.log(markerPopup);

  //$.get(`/users/${USER_ID}`)
  //$.get(`/points/${POINT_ID}`, pointToEdit)
  $.post(`/points/${POINT_ID}/edit`, pointToEdit).then((point) => {
    console.log("point returned after GET /points/:id: ", point);
    let marker = new L.marker([point.latitude, point.longitude]);
    marker.bindPopup(markerPopup).openPopup();
    map.addLayer(marker);
    $("#pin-deets").hide();
  });
});

// map.on("click", onMapClick);

// const renderMap = (lat, long) => {
//   const map = L.map("map").setView([lat, long], 13);
//   const mapTiles = {
//     id: "mapbox/streets-v11",
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken:
//       "pk.eyJ1IjoiZ2FnYW5zaW5naDMiLCJhIjoiY2wyd2RqY3l2MDg2NjNjcXU5cDNoaHJmbyJ9.WaGj9j3kU-EKhz0-tQSD6w",
//   };

//   L.tileLayer(
//     "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={pk.eyJ1IjoiZGtlbGw4OCIsImEiOiJjbDJ3Zm44NjMwZjVqM2RxY3gyN3J6dXJ2In0.SYE3QdtfFxH63YvUTI7FMA}",
//     mapTiles
//   ).addTo(map);

//   addGoogleSearch(map);
//   addMarker(map);
// };

const addMarker = (myMap) => {
  myMap.on("click", (e) => {
    lat = e.latlng.lat;
    lon = e.latlng.lng;

    //Add a marker to show where you clicked.
    let marker = L.marker([lat, lon])
      .addTo(myMap)
      .bindPopup(`Lat: ${lat.toFixed(2)}<br> long: ${lon.toFixed(2)}`)
      .openPopup();
  });
};
