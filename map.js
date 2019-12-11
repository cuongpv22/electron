function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 21.0278, lng: 105.8342},
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
 
  var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(21.012414,105.811143),
    new google.maps.LatLng(21.012414,105.811143));
    
    

  // var options = {
  //   bounds: defaultBounds,
  //   types: ['establishment']
  // };
  
  // autocomplete = new google.maps.places.Autocomplete(input, options);
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var geocoder = new google.maps.Geocoder();

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    var address = document.getElementById('current-location').value;
    // searchBox.setBounds(map.getBounds());
    geocodeAddress(geocoder,map,address);  
    searchBox.setBounds(defaultBounds);
  });
  

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  
  searchBox.addListener('places_changed', function() {

    
    
    var places = searchBox.getPlaces();
   
    if (places.length == 0) {
      return;
    }
    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

function geocodeAddress(geocoder, resultsMap,address) {
  geocoder.geocode({'address': address  }, function(results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
      var latCurrent = results[0].geometry.location.lat
      console.log(latCurrent);
      //  defaultBounds = new google.maps.LatLngBounds(
      //   new google.maps.LatLng(21.012414,105.811143),
      //   new google.maps.LatLng(21.012414,105.811143));
       marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

function drawPath() {
  new google.maps.Polyline({
    path : pathCoordinates,
    geodesic : true,
    strokeColor : '#FF0000',
    strokeOpacity : 1,
    strokeWeight : 4,
    map : map
  });
}
function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function addMarker(pos) {
  var marker = new google.maps.Marker({
    position: {lat: pos.lat, lng: pos.lon},
    map: _map
    //title: pos.id
  });

  markers.push(marker);
}
