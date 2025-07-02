// === main.js ===

const aircraftGroups = {
  "Бизнес-джеты": {
    "Gulfstream G600":        { takeoff: 1795, range: 12000 },
    "Dassault Falcon 8X":     { takeoff: 1790, range: 12000 },
    "Cessna Citation CJ4":    { takeoff: 970,  range: 3700 }
  },
  "Турбовинтовые региональные": {
    "ATR 42-500":             { takeoff: 1050, range: 1100 },
    "ATR 72-600":             { takeoff: 1315, range: 1500 },
    "Dash 8 Q400":            { takeoff: 1390, range: 2000 }
  },
  "Региональные реактивные": {
    "Embraer E175 (MTOW)":    { takeoff: 1724, range: 3700 },
    "Embraer E195-E2":        { takeoff: 2110, range: 4800 }
  },
  "Магистральные узкофюзеляжные": {
    "Airbus A320-200":        { takeoff: 2000, range: 6100 },
    "Boeing 737-800":         { takeoff: 2316, range: 5436 }
  }
};

let map, rangeCircle;

function getRunwayLength() {
  const selected = document.querySelector('input[name="runway"]:checked').value;
  if (selected === "custom") {
    const val = parseInt(document.getElementById("customRunway").value, 10);
    return isNaN(val) ? 0 : val;
  }
  return parseInt(selected, 10);
}

function populateAircraftSelect(groupName) {
  const aircraftSelect = document.getElementById("aircraftSelect");
  aircraftSelect.innerHTML = "";
  const group = aircraftGroups[groupName];
  for (const model in group) {
    const opt = document.createElement("option");
    opt.value = model;
    opt.textContent = model;
    aircraftSelect.appendChild(opt);
  }
  updateResult();
}

function initMap() {
  const airportCenter = { lat: 32.8145, lng: 35.0432 };
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

  const runwayCoords = [
    { lat: 32.81702, lng: 35.04190 },
    { lat: 32.81756, lng: 35.04285 },
    { lat: 32.81187, lng: 35.04444 },
    { lat: 32.81132, lng: 35.04346 }
  ];
  new google.maps.Polygon({
    paths: runwayCoords,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    map
  });

  const groupSelect = document.getElementById("groupSelect");
  Object.keys(aircraftGroups).forEach(group => {
    const opt = document.createElement("option");
    opt.value = group;
    opt.textContent = group;
    groupSelect.appendChild(opt);
  });

  groupSelect.addEventListener("change", () => {
    populateAircraftSelect(groupSelect.value);
  });
  populateAircraftSelect(groupSelect.value);

  ["aircraftSelect", "tempSlider", "windSlider", "loadSelect", "customRunway"].forEach(id => {
    document.getElementById(id).addEventListener("input", updateResult);
  });
  document.querySelectorAll('input[name="runway"]').forEach(r => {
    r.addEventListener("change", () => {
      document.getElementById("customRunway").disabled = r.value !== "custom";
      updateResult();
    });
  });
}

function updateResult() {
  const group = document.getElementById("groupSelect").value;
  const ac = document.getElementById("aircraftSelect").value;
  const { takeoff, range } = aircraftGroups[group][ac];

  const temp = parseInt(document.getElementById("tempSlider").value);
  const wind = parseInt(document.getElementById("windSlider").value);
  const load = parseFloat(document.getElementById("loadSelect").value);

  const tempPenalty = Math.max(0, temp - 15) * 0.01 / 3;
  const takeoffAdjusted = takeoff * (1 + tempPenalty);
  const windFactor = wind * 0.01 / 2;
  const takeoffFinal = takeoffAdjusted * (1 - windFactor);
  const rangeFinal = Math.round(range * load);

  const runwayLength = getRunwayLength();
  const delta = Math.round(takeoffFinal - runwayLength);
  const resEl = document.getElementById("result");

  if (delta <= 0) {
    resEl.innerHTML = `✔ <span class="ok">Полоса подходит</span> (запас ${Math.abs(delta)} м).<br>Дальность ≈ ${rangeFinal} км.`;
  } else {
    resEl.innerHTML = `✘ <span class="fail">Не хватает ${delta} м</span>; нужно ≥ ${Math.round(takeoffFinal)} м.<br>После удлинения: дальность ≈ ${rangeFinal} км.`;
  }

  drawRangeCircle(rangeFinal, delta <= 0);
}

function drawRangeCircle(rangeKm, canOperateNow) {
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
  if (rangeKm > 2000) map.fitBounds(rangeCircle.getBounds());
}

(function addGoogleMapsScript() {
  const key = "{{GMAP_API}}";
  if (!key || key.includes("{{")) {
    console.error("Google Maps API key not injected.");
    return;
  }
  const s = document.createElement("script");
  s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=geometry&callback=initMap`;
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);
})();