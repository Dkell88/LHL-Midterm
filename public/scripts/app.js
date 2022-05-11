
$(() => {

  const loadMap = function() {
    const map = L.map('map', {
      doubleClickZoom: false,
      bubblingMouseEvents: true}
      ).setView([49.262838, -122.781071], 16);
  
      return map;
  };
    
    const renderMap = function(map) {

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoiZGtlbGw4OCIsImEiOiJjbDJ3Zm44NjMwZjVqM2RxY3gyN3J6dXJ2In0.SYE3QdtfFxH63YvUTI7FMA'
    }).addTo(map);
   
    L.control.scale({
      metric: true,
      imperial: false,
      position: 'bottomright'
    }).addTo(map);
    //console.log("This is the map object: ", map)
  };
  
  const setupLayerGroup = function(map) {

    let markerPopupTest = `
      <div>
      <form id="pointForm">
        <textarea name="title" placeholder="Title of the pin?"></textarea><br>
        <textarea name="description" placeholder="Description of the pin?"></textarea><br>
        <textarea name="img-url" placeholder="Image URL"></textarea><br>
        <div>
          <button class="pin-deets-submit" type="submit">sumbit</button>
          <button class="pin-deets-delete" type="reset">delete</button>
        </div>
      </form>
    </div>`
    
    const markerLayerGroup = L.layerGroup().addTo(map);
    markerLayerGroup.addLayer(marker2)
 
    const overlay = {'markers': markerLayerGroup};
    const options = {'position': 'bottomleft'};
    L.control.layers(null, overlay, options).addTo(map);

    return markerLayerGroup;
  }

  const getPopupID = function () {
  
    let = layerToEdit = -999;
    const layers = markerLayerGroup.getLayers()
    for(const layer of layers){;
      if (layer.isPopupOpen()) {
        return layer
      }
    }
    return false
  };

  function onMapClick(event) {
    console.log("onclick")

    let point = {
      mapId: 41,
      leafletId: -999,
      title: "",
      description: "",
      imageURL: "",
      latitude: event.latlng.lat,
      longitude: event.latlng.lng
    }
    //console.log("Point before modifying the leaflet ID: ", point);
    //console.log("Point before modifying the leaflet ID: ", point.leafletId);
    
    let markerPopup = `
    <div >
    <form class="pointForm">
    <textarea name="title" placeholder="Title of the pin?"></textarea><br>
    <textarea name="description" placeholder="Description of the pin?"></textarea><br>
    <textarea name="img-url" placeholder="Image URL"></textarea><br>
    <button class="pin-deets-submit" type="submit">sumbit</button>
    <button class="pin-deets-delete">delete</button>
    </form>
    </div>`
    
    $.post('points/', point)
    .then((pointPosted) => {
      let marker = new L.marker(
        [pointPosted.latitude, pointPosted.longitude], 
        {
          bubblingMouseEvents: true,
          title: pointPosted.id
        });
        marker.bindPopup(markerPopup).openPopup();
        markerLayerGroup.addLayer(marker);
        markerLayerGroup.addTo(map) 
        const num = marker._leaflet_id;
        pointPosted.leafletId = num;
        console.log("THe point was added this is what you'll need to edit: ", pointPosted);
        $.post(`/points/${pointPosted.id}/edit`, pointPosted)
        .then(point => {
          console.log("point returned after POST /points/:id: ", point)
        })
        .catch((e) =>{
          console.log(e)
        })
    })

    
      // console.log("This is the marker layer ", markerLayer)
      // markerLayerGroup.addTo(featureGroup)
      // featureGroup.addTo(map);
      // console.log("featureGroup ", featureGroup);
      //map.addLayer(markerLayer);
      //console.log("This is the map object: ", map);
      //console.log("This is the layergroup object: ", markerLayerGroup);

      //console.log("This is the markers layer ID: ", marker._leaflet_id);
      //markerLayerGroup.removeFrom(map);
    }
    
   
    $('#map').on('submit', '.pointForm', function(event) {
      event.preventDefault();
      console.log("Sumbitted");
      const kids = $(this).has('textarea');
      console.log("Submit THIS: ", this)
      console.log("Submit kids: ", kids)
      const pointToEdit = {
        title: $(kids[0][0]).val(),
        description: $(kids[0][1]).val(),
        imageURL: $(kids[0][2]).val(),
        leafletId: -999
      };
      console.log(pointToEdit)

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
      console.log("This is the layer to be edtited line 164 ", layerToEdit)
      console.log("THis i sthe title, which should match the point.id", layerToEdit.options.title);
      console.log(layerToEdit._leaflet_id);

      $.get(`points/${pointIdToEdit}`)
      .then(point => {
        console.log("point returned after GET /points/:id:", point)
        $.post(`/points/${point.id}/edit`, pointToEdit)
          .then(point => {
            layerToEdit.setPopupContent(markerPopupDetails);
            console.log("point returned after POST /points/:id: editting the popup", point)
          })
      })
      // $.post('/render', layers)

    });
    
    $('#map').on('click', '.pin-deets-delete', function(event) {

      event.preventDefault();
      console.log("delete pressed");

      layerToDelete = getPopupID(); 
      pointIdToDelete = layerToDelete.options.title;

      $.post(`/points/${pointIdToDelete}/delete`)
      .then((point) => {
        console.log("Point deleted", point)
        layerToDelete.remove();
      }).catch((e) =>{
        console.log(e.responseJSON)
      })

    })

    $('#map').on('click', '.pin-deets-edit', function(event) {

      event.preventDefault();
      console.log("edit pressed");

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
      console.log("confirm pressed");

      console.log("This: ", this)
      const kids = $(this).parent().parent().has('textarea')
      const pointToEdit = {
        title: $(kids[0][0]).val(),
        description: $(kids[0][1]).val(),
        imageURL: $(kids[0][2]).val(),
        leafletId: -999
      };
      console.log(pointToEdit)

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
      console.log("This is the layer to be edtited line 164 ", layerToEdit)
      console.log("THis i sthe title, which should match the point.id", layerToEdit.options.title);
      console.log(layerToEdit._leaflet_id);

      $.get(`points/${pointIdToEdit}`)
      .then(point => {
        console.log("point returned after GET /points/:id:", point)
        pointToEdit.leafletId = point.leafletId;
        $.post(`/points/${point.id}/edit`, pointToEdit)
          .then(point => {
            layerToEdit.setPopupContent(markerPopupDetails);
            console.log("point returned after POST /points/:id: editting the popup", point)
          })
      })

    })
    $('#map').on('click', '.pin-deets-cancel', function(event) {

      event.preventDefault();
      console.log("cancel pressed");

      layerToRestore = getPopupID(); 
      pointIdToRestore = layerToRestore.options.title;
      console.log("This is the layer title within the cancel listener: ", pointIdToRestore);
      
      $.get(`/points/${pointIdToRestore}` )
      .then((point) =>{
        console.log("This is the point returned by the cancel function: ", point)
        console.log("The image url", point.image_url)
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
      
    })
    
    const map = loadMap();
    renderMap(map);
    const markerLayerGroup = setupLayerGroup(map);
    map.on('click', onMapClick);


    markerLayerGroup.on('click', function(ev){
      console.log("marker layer groups has been clicked", ev)
    })



    // $('#map').on('click', '.leaflet-marker-draggable', function(event) {
    //     console.log("CLick event, hopefully do to drag?", event)
    // });

    // const onMapMouseUp = function (event) {
    //   console.log("this is a mouse up event: ", event)
    // }

    // map.on('mouseup', onMapMouseUp,);
  
 
     // featureGroup.on('click', function(ev){
     //   console.log("marker layer groups has been clicked", ev)
     // })
     
    
  });
