// Creating the map object
let myMap = L.map("map", {
  center: [27.96044, -82.30695],
  zoom: 3,
});

// Adding the tile layer
let base = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});
base.addTo(myMap);

// Load the GeoJSON data.
let geoData =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Get the data using d3 library
d3.json(geoData).then(function (data) {
  function setRadius(dog) {
    if (dog == 0) {
      return 1;
    }
    return dog * 5;
  }

  // Creating the marker color scale
  function assignColor(cat) {
    switch (true) {
      case cat > 90:
        return "red";
      case cat > 70:
        return "orangered";
      case cat > 50:
        return "orange";
      case cat > 30:
        return "yellow";
      case cat > 10:
        return "yellowgreen";
      default:
        return "green";
    }
  }

  // Styling the markers
  function stylish(x) {
    return {
      color: "#000000",
      fillColor: assignColor(x.geometry.coordinates[2]),
      radius: setRadius(x.properties.mag),
      fillOpacity: 1,
      weight: 0.5,
    };
  }

  // Creating the markers
  L.geoJson(data, {
    pointToLayer: function (feature, latLong) {
      return L.circleMarker(latLong);
    },

    style: stylish,

    // Addind a popup
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Earthquake's magnitude: " +
          feature.properties.mag +
          " | Earthquake's location: " +
          feature.properties.place +
          " | Earthquake's depth: " +
          feature.geometry.coordinates[2]
      );
    },
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend"),
      scale = [-10, 10, 30, 50, 70, 90];

    for (var i = 0; i < scale.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        assignColor(scale[i] + 1) +
        '"></i> ' +
        scale[i] +
        (scale[i + 1] ? "&ndash;" + scale[i + 1] + "<br>" : "+");
    }

    return div;
  };

  legend.addTo(myMap);
});
