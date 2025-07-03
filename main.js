const aircraftGroups = {
  "Бизнес-джеты": {
    "Gulfstream G600":        { takeoff: 1795, range: 12000, capacity: 19, cruise: 903 },
    "Dassault Falcon 8X":     { takeoff: 1790, range: 12000, capacity: 16, cruise: 900 },
    "Cessna Citation CJ4":    { takeoff: 970,  range: 3700,  capacity: 10, cruise: 835 }
  },
  "Турбовинтовые региональные": {
    "Dash 8 Q400":            { takeoff: 1390, range: 2000,  capacity: 78, cruise: 667 },
    "ATR 72-600":             { takeoff: 1315, range: 1500,  capacity: 70, cruise: 511 },
    "ATR 42-500":             { takeoff: 1050, range: 1100,  capacity: 50, cruise: 556 }
  },
  "Региональные реактивные": {
    "Embraer E195-E2":        { takeoff: 2110, range: 4800,  capacity: 132, cruise: 870 },
    "Embraer E175 (MTOW)":    { takeoff: 1724, range: 3700,  capacity: 88,  cruise: 829 }
  },
  "Магистральные узкофюзеляжные": {
    "Airbus A320-200":        { takeoff: 2000, range: 6100,  capacity: 180, cruise: 828 },
    "Boeing 737-800":         { takeoff: 2316, range: 5436,  capacity: 189, cruise: 842 }
  },
  "STOL и лёгкие региональные": {
    "Learjet 75 Liberty":     { takeoff: 1260, range: 3800,  capacity: 9,  cruise: 860 },
    "Pilatus PC-12":          { takeoff: 793,  range: 3400,  capacity: 9,  cruise: 528 },
    "Beechcraft King Air 350":{ takeoff: 1006, range: 3300,  capacity: 11, cruise: 578 },
    "HondaJet HA-420":        { takeoff: 1050, range: 2200,  capacity: 6,  cruise: 782 },
    "Cessna 208 Caravan":     { takeoff: 660,  range: 1900,  capacity: 14, cruise: 341 },
    "Cessna 408 SkyCourier":  { takeoff: 1100, range: 1600,  capacity: 19, cruise: 370 },
    "Let L-410 Turbolet":     { takeoff: 610,  range: 1500,  capacity: 19, cruise: 405 },
    "Viking DHC-6 Twin Otter":{ takeoff: 366,  range: 1400,  capacity: 19, cruise: 338 }
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
  updateAircraftInfo(groupName, aircraftSelect.value);
  updateResult();
}

function updateResult() {
  const group = document.getElementById("categorySelect").value;
  const ac = document.getElementById("aircraftSelect").value;
  const data = aircraftGroups[group][ac];
  if (!data) return;

  const { takeoff, range, capacity, cruise } = data;
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
  const imageName = ac.replace(/\s+/g, "_").replace(/[()]/g, "") + ".jpg";

  resEl.innerHTML = `
    <strong>${ac}</strong><br>
    <img src="img/aircraft/${imageName}" alt="${ac}" style="max-width: 100%; max-height: 120px;"><br><br>
    👥 Вместимость: ${capacity || "?"} чел<br>
    ✈️ Взлётная дистанция: ${Math.round(takeoffFinal)} м<br>
    📏 Дальность: ${rangeFinal} км<br>
    🚀 Крейсерская скорость: ${cruise || "?"} км/ч<br><br>
    ${
      delta <= 0
        ? `✔ <span class="ok">Полоса подходит</span> (запас ${Math.abs(delta)} м).`
        : `✘ <span class="fail">Не хватает ${delta} м</span>; нужно ≥ ${Math.round(takeoffFinal)} м.`
    }
  `;

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

  if (rangeKm > 2000 && map.getZoom() < 10) {
    map.fitBounds(rangeCircle.getBounds());
  }
}

function updateAircraftInfo(group, model) {
  const infoEl = document.getElementById("aircraftInfo");
  if (!group || !model) return (infoEl.textContent = "");
  const aircraft = aircraftGroups[group][model];
  if (!aircraft) return (infoEl.textContent = "");
  // Можно показать краткую справку тут, если нужно
}

// Сделать initMap глобальной
window.initMap = function () {
  const airportCenter = { lat: 32.8145, lng: 35.0432 }; // Аэропорт Хайфы
  map = new google.maps.Map(document.getElementById("map"), {
    center: airportCenter,
    zoom: 12,
    mapTypeId: "roadmap",
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

  const categorySelect = document.getElementById("categorySelect");
  Object.keys(aircraftGroups).forEach(group => {
    const opt = document.createElement("option");
    opt.value = group;
    opt.textContent = group;
    categorySelect.appendChild(opt);
  });

  categorySelect.addEventListener("change", () => {
    populateAircraftSelect(categorySelect.value);
  });

  populateAircraftSelect(categorySelect.value);

  ["aircraftSelect", "tempSlider", "windSlider", "loadSelect", "customRunway"].forEach(id => {
    document.getElementById(id).addEventListener("input", updateResult);
  });

  document.querySelectorAll('input[name="runway"]').forEach(r => {
    r.addEventListener("change", () => {
      document.getElementById("customRunway").disabled = r.value !== "custom";
      updateResult();
    });
  });

  // Ползунки температуры и ветра
  document.getElementById("tempSlider").addEventListener("input", (e) => {
    document.getElementById("tempVal").textContent = `${e.target.value}°C`;
  });
  document.getElementById("windSlider").addEventListener("input", (e) => {
    document.getElementById("windVal").textContent = `${e.target.value} км/ч`;
  });

  document.getElementById("aircraftSelect").addEventListener("change", () => {
    updateAircraftInfo(categorySelect.value, aircraftSelect.value);
    updateResult();
  });
};
