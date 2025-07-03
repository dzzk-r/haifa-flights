let map, rangeCircle;

export function initMap() {
  const airportCenter = { lat: 32.8145, lng: 35.0432 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: airportCenter,
    zoom: 12,
    restriction: {
      latLngBounds: {
        north: 85,
        south: -85,
        west: -180,
        east: 180,
      },
      strictBounds: false
    },
    minZoom: 4,
    mapTypeId: "roadmap",
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT
    }
  });

  return map;
}

export function drawRangeCircle(rangeKm, canOperateNow) {
  if (rangeCircle) rangeCircle.setMap(null);
  rangeCircle = new google.maps.Circle({
    strokeColor: canOperateNow ? "#00AA00" : "#FF0000",
    strokeOpacity: 0.6,
    strokeWeight: 2,
    fillColor: canOperateNow ? "#00AA00" : "#FF0000",
    fillOpacity: 0.06,
    center: { lat: 32.8145, lng: 35.0432 },
    radius: rangeKm * 1000,
    map
  });

  if (rangeKm <= 3000 && map.getZoom() < 10) {
    const bounds = rangeCircle.getBounds();
    if (bounds) map.fitBounds(bounds);
  }
}

export function getMap() {
  return map;
}

window.initMap = initMap;
