export function drawRunway(map) {
  const runwayBounds = {
    north: 32.8185,
    south: 32.8105,
    east: 35.0505,
    west: 35.0395,
  };

  const runwayRect = new google.maps.Rectangle({
    strokeColor: '#000000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#555555',
    fillOpacity: 0.4,
    map,
    bounds: runwayBounds,
  });

  return runwayRect;
}
