let runwayPolygon;

export function drawRunway(map) {
  const runwayCoords = [
    { lat: 32.8157816, lng: 35.0411338 },
    { lat: 32.8046002, lng: 35.0460476 },
    { lat: 32.8046994, lng: 35.0463587 },
    { lat: 32.8158898, lng: 35.0414342 },
    { lat: 32.8157816, lng: 35.0411338 } // закрытие контура
  ];

  if (runwayPolygon) {
    runwayPolygon.setMap(null); // удалить старый, если есть
  }

  runwayPolygon = new google.maps.Polygon({
    paths: runwayCoords,
    strokeColor: "#ff0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#ff0000",
    fillOpacity: 0.2,
    clickable: false
  });

  runwayPolygon.setMap(map);
}
