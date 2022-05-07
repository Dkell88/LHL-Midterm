// Client facing scripts here
$(() => {
  renderMap();
});

const renderMap = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const map = L.map("map").setView([latitude, longitude], 13);

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
  });
};
