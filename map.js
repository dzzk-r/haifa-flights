// === map.js ===

let map, rangeCircle;

const airportCenter = { lat: 32.8145, lng: 35.0432 };

const runwayCoords = [
  { lat: 32.81702, lng: 35.04190 },
  { lat: 32.81756, lng: 35.04285 },
  { lat: 32.81187, lng: 35.04444 },
  { lat: 32.81132, lng: 35.04346 }
];

export function initMap(callbackOnReady) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: airportCenter,
    zoom: 6,
    mapTypeId: "hybrid",
    disableDefaultUI: false,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT
    }
  });

  new google.maps.Polygon({
    paths: runwayCoords,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    map
  });

  if (typeof callbackOnReady === "function") callbackOnReady();
}

export function drawRangeCircle(rangeKm, canOperateNow) {
  if (rangeCircle) rangeCircle.setMap(null);
  rangeCircle = new google.maps.Circle({
    strokeColor: canOperateNow ? "#00AA00" : "#FF0000",
    strokeOpacity: 0.6,
    strokeWeight: 2,
    fillColor: canOperateNow ? "#00AA00" : "#FF0000",
    fillOpacity: 0.06,
    center: airportCenter,
    radius: rangeKm * 1000,
    map
  });
  if (rangeKm > 2000) map.fitBounds(rangeCircle.getBounds());
}
