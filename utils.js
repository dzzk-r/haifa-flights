export function getRunwayLength() {
  const selected = document.querySelector('input[name="runway"]:checked').value;
  if (selected === "custom") {
    const val = parseInt(document.getElementById("customRunway").value, 10);
    return isNaN(val) ? 0 : val;
  }
  return parseInt(selected, 10);
}

export function logMapDebug(map, rangeCircle, aircraftName, weather, loading, runwayLength) {
  console.log("===== Google Map Debug Info v2 =====");

  const center = map.getCenter().toJSON();
  console.log("📍 Центр карты:", center);

  console.log("🔍 Zoom:", map.getZoom());

  const bounds = map.getBounds();
  if (bounds) {
    console.log("🗺️ Bounds:", {
      northEast: bounds.getNorthEast().toJSON(),
      southWest: bounds.getSouthWest().toJSON()
    });
  }

  const mapEl = document.getElementById("map");
  if (mapEl) {
    const rect = mapEl.getBoundingClientRect();
    console.log("📐 DOM-элемент карты:", {
      width: rect.width + "px",
      height: rect.height + "px"
    });
  }

  if (rangeCircle) {
    const circleCenter = rangeCircle.getCenter().toJSON();
    const radiusKm = rangeCircle.getRadius() / 1000;
    console.log("⭕ Circle center:", circleCenter);
    console.log("📏 Circle radius:", radiusKm + " км");
  }

  if (aircraftName) console.log("🛩️ Самолёт:", aircraftName);
  if (weather) {
    console.log("🌡️ Температура:", weather.temperature + "°C");
    console.log("💨 Ветер:", weather.wind + " км/ч");
  }
  if (loading !== undefined) console.log("📦 Загрузка:", loading);
  if (runwayLength) console.log("🛬 Длина полосы:", runwayLength + " м");
}