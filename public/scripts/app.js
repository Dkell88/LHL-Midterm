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

const getCurrentUserLocation = (map) => {
  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    map.setView([latitude, longitude], 15);
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
  getCurrentUserLocation(map);
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

  const setupLayerGroup = function(map) {
    
    const markerLayerGroup = L.layerGroup().addTo(map);
    const overlay = {'markers': markerLayerGroup};
    const options = {'position': 'bottomleft'};
    L.control.layers(null, overlay, options).addTo(map);

    return markerLayerGroup;
  }

  const getPopupID = function () {
 
    const layers = markerLayerGroup.getLayers()
    for(const layer of layers){;
      if (layer.isPopupOpen()) {
        return layer
      }
    }
    return false
  };

  function onMapClick(event) {
  
    let point = {
      mapId: 41, //-------------NEED TO ADD SESSIONS
      leafletId: -999,
      title: "",
      description: "",
      imageURL: "",
      latitude: event.latlng.lat,
      longitude: event.latlng.lng
    }


    let markerPopup = `
      <div >
        <form class="pointForm">
          <textarea name="title" placeholder="Title of the pin?"></textarea><br>
          <textarea name="description" placeholder="Description of the pin?"></textarea><br>
          <textarea name="img-url" placeholder="Image URL"></textarea><br>
          <div>
            <button class="pin-deets-submit" type="submit">sumbit</button>
            <button class="pin-deets-delete">delete</button>
          </div>
        </form>
      </div>`
    
    $.post('points/', point)
    .then((pointPosted) => {
      let marker = new L.marker(
        [pointPosted.latitude, pointPosted.longitude], 
        {
          //bubblingMouseEvents: true,
          title: pointPosted.id
        });

        marker.bindPopup(markerPopup).openPopup();
        markerLayerGroup.addLayer(marker);
        markerLayerGroup.addTo(map)

        const num = marker._leaflet_id;
        pointPosted.leafletId = num;
        
        $.post(`/points/${pointPosted.id}/edit`, pointPosted)
        .catch((e) =>{
          console.log(e)
        });
      });
    };
    
   
  $('#map').on('submit', '.pointForm', function(event) {
    event.preventDefault();  
    
      const photoURL = 'https://source.unsplash.com/random'
      console.log(photoURL);
      
      const kids = $(this).has('textarea');
        const pointToEdit = {
          title: $(kids[0][0]).val(),
          description: $(kids[0][1]).val(),
          imageURL: $(kids[0][2]).val(),
          leafletId: -999
        };
        
        let markerPopupDetails = `
          <section class = "pin-popus">
          <span>${pointToEdit.title}</span><br>
          <span>${pointToEdit.description}</span><br>
            <img src="${photoURL}">
            <div>
            <button class="pin-deets-edit">Edit</button>
            <button class="pin-deets-delete">Delete</button>
            </div>
            </section>`
            
            layerToEdit = getPopupID();
            pointIdToEdit = layerToEdit.options.title;
            
            $.get(`points/${pointIdToEdit}`)
            .then(point => {
              $.post(`/points/${point.id}/edit`, pointToEdit)
              .then(point => {
                layerToEdit.setPopupContent(markerPopupDetails);
              })
            })
            
      });
    
    $('#map').on('click', '.pin-deets-delete', function(event) {

      event.preventDefault();
 
      layerToDelete = getPopupID(); 
      pointIdToDelete = layerToDelete.options.title;

      $.post(`/points/${pointIdToDelete}/delete`)
        .then(() => {
          layerToDelete.remove();
          layerToDelete.remove(markerLayerGroup);
        }).catch((e) =>{
          console.log(e.responseJSON)
      })

    })

    $('#map').on('click', '.pin-deets-edit', function(event) {

      event.preventDefault();
 
      let markerPopupAppend = `
        <div >
          <form class="pointForm">
            <textarea name="title" placeholder="Title of the pin?"></textarea><br>
            <textarea name="description" placeholder="Description of the pin?"></textarea><br>
            <textarea name="img-url" placeholder="Image URL"></textarea><br>
            <div>
              <button class="pin-deets-confirm" >confirm</button>
              <button class="pin-deets-cancel">cancel</button>
            </div>
          </form>
        </div>`

      layerToAppend = getPopupID(); 
      layerToAppend.setPopupContent(markerPopupAppend);

    })

    $('#map').on('click', '.pin-deets-confirm', function(event) {
      event.preventDefault();
    
      const kids = $(this).parent().parent().has('textarea')
      const pointToEdit = {
        title: $(kids[0][0]).val(),
        description: $(kids[0][1]).val(),
        imageURL: $(kids[0][2]).val(),
        leafletId: -999
      };
      
      let markerPopupDetails = `
        <section class = "pin-popus">
          <span>${pointToEdit.title}</span><br>
          <span>${pointToEdit.description}</span><br>
          <img src="${pointToEdit.imageURL}">
          <div>
            <button class="pin-deets-edit">Edit</button>
            <button class="pin-deets-delete">Delete</button>
          </div>
        </section>`

      layerToEdit = getPopupID();
      pointIdToEdit = layerToEdit.options.title;

      $.get(`points/${pointIdToEdit}`)
      .then(point => {
        pointToEdit.leafletId = point.leafletId;
        $.post(`/points/${point.id}/edit`, pointToEdit)
          .then(point => {
            layerToEdit.setPopupContent(markerPopupDetails);
          })
      })

    })
    $('#map').on('click', '.pin-deets-cancel', function(event) {

      event.preventDefault();

      layerToRestore = getPopupID(); 
      pointIdToRestore = layerToRestore.options.title;
           
      $.get(`/points/${pointIdToRestore}`)
        .then((point) =>{
          let markerPopupDetails = `
          <section class = "pin-popus">
            <span>${point.title}</span><br>
            <span>${point.description}</span><br>
            <img src="${point.image_url}">
            <div>
            <button class="pin-deets-edit">Edit</button>
              <button class="pin-deets-delete">Delete</button>
            </div>
          </section>`
          layerToRestore.setPopupContent(markerPopupDetails);
        })   
    });
    
    const map = loadMap();
    renderMap(map);
    const markerLayerGroup = setupLayerGroup(map);
    map.on('click', onMapClick);
    
});

