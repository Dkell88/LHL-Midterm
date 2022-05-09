// Client facing scripts here
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

const renderMap = (lat, long) => {
  const map = L.map("map").setView([lat, long], 13);
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
  addMarker(map);
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
