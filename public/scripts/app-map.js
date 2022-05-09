// let map = L.map("map", {
//   crs: L.CRS.Simple,
//   minZoom: 1,
//   maxZoom: 4,
// });
// let bounds = [
//   [604.8559938231735, 128.1198587140413],
//   [95.59849526072463, 580.8858370243247],
// ];

// //WESTEROS MAP
// // https://www.boredpanda.com/blog/wp-content/uploads/2019/04/game-of-thrones-westeros-map-julio-lacerda-29.jpg
// let image = L.imageOverlay("azeroth.jpeg", bounds, {
//   crs: L.CRS.Simple,
// }).addTo(map);
// map.fitBounds(bounds);
// L.tileLayer("westeros.png", {
//   minZoom: 1,
//   maxZoom: 10,
//   contiuousWorl: false,
//   noWrap: true,
// }).addTo(map);

//pin
// let marker = L.marker([lat, lng]).addTo(map);

//circle
// let circle = L.circle([50.9838, -114.127528], {
//   color: "red",
//   fillColor: "#f03",
//   fillOpacity: 0.5,
//   radius: 1500,
// }).addTo(map);

//polygon shape
// let polygon = L.polygon([
//   [51.019687, -114.095678],
//   [51.008829, -114.095421],
//   [51.00937, -114.085892],
// ]).addTo(map);

//popups (descriptions)

//openPopup makes the popup start open
// marker.bindPopup("Hello From Calgary!").openPopup();
//hidden by default, opens on click
// circle.bindPopup("I am a circle");
// polygon.bindPopup("I am a polygon");

//click event
// function onMapClick(e) {
//   alert("You clicked the map at " + e.latlng);
// }

// map.on("click", onMapClick);

//OPEN MAPS

let map = L.map("map").setView([51.01090311074301, -114.08135290095032], 11);

//MAPBOX MAP
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
      "pk.eyJ1IjoiZ2FnYW5zaW5naDMiLCJhIjoiY2wyd2RqY3l2MDg2NjNjcXU5cDNoaHJmbyJ9.WaGj9j3kU-EKhz0-tQSD6w",
  }
).addTo(map);

//GOOGLE PLACES SEARCH
// L.Control.GPlaceAutocomplete().addTo(map);

// L.Control.GPlaceAutocomplete({
//   callback: function (place) {
//     var loc = place.geometry.location;
//     map.setView([loc.lat(), loc.lng()], 18);
//   },
// }).addTo(map);

const searchControl = new L.esri.Controls.Geosearch().addTo(map);
const result = new L.LayerGroup().addTo(map);
searchControl.on("results", function (data) {
  results.clearLayers();
  for (var i = data.results.length - 1; i >= 0; i--) {
    results.addLayer(L.marker(data.results[i].latlng));
  }
});

const myIcon = L.icon({
  iconUrl: "rabbit.png",
  iconSize: [64, 64],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
  // shadowUrl: "my-icon-shadow.png",
  // shadowSize: [68, 95],
  // shadowAnchor: [22, 94],
});

// L.marker([50.505, 30.57], { icon: myIcon }).addTo(map);

// drop a marker on a single click

map.on("click", (e) => {
  navigator.geolocation.getCurrentPosition((position) => {
    let marker = L.marker([e.latlng.lat, e.latlng.lng], {
      icon: myIcon,
      draggable: true,
    }).addTo(map);
  });
  console.log(`Your click is at lat: ${e.latlng.lat}, long: ${e.latlng.lng}`);
});
