/**
 * === Константы и данные ===
 */
const aircraftData = {
  "ATR 72-600": { takeoff: 1315, range: 1500 },
  "Embraer E175 (MTOW)": { takeoff: 1724, range: 3700 },
  "Boeing 737-800": { takeoff: 2316, range: 5436 },
  "Airbus A320-200": { takeoff: 2000, range: 6100 },
  "Embraer E195-E2": { takeoff: 2110, range: 4800 },
  "ATR 42-500": { takeoff: 1050, range: 1100 },
  "Gulfstream G600": { takeoff: 1795, range: 12000 },
};

let map, rangeCircle;

/**
 * === Получение текущей длины ВПП (выбор или ручной ввод) ===
 */
function getRunwayLength() {
  const selected = document.querySelector('input[name="runway"]:checked').value;
  if (selected === "custom") {
    const val = parseInt(document.getElementById("customRunway").value, 10);
    return isNaN(val) ? 0 : val;
  }
  return parseInt(selected, 10);
}

/**
 * === Call‑back для Google Maps API ===
 */
function initMap() {
  const airportCenter = { lat: 32.8145, lng: 35.0432 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: airportCenter,
    zoom: 6,
    mapTypeId: "hybrid", // начнем со спутника
    disableDefaultUI: false,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT
    }
  });

  // Прямоугольник приблизительного контура ВПП
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

  // Рендер списка самолётов
  const select = document.getElementById("aircraftSelect");
  Object.keys(aircraftData).forEach(ac => {
    const opt = document.createElement("option");
    opt.value = ac;
    opt.textContent = ac;
    select.appendChild(opt);
  });

  select.addEventListener("change", updateResult);
  ["tempSlider", "windSlider", "loadSelect"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => {
      document.getElementById("tempValue").textContent = document.getElementById("tempSlider").value;
      document.getElementById("windValue").textContent = document.getElementById("windSlider").value;
      updateResult();
    });
  });

  document.querySelectorAll('input[name="runway"]').forEach(r => {
    r.addEventListener("change", () => {
      document.getElementById("customRunway").disabled = r.value !== "custom";
      updateResult();
    });
  });

  document.getElementById("customRunway").addEventListener("input", updateResult);

  // Авторасчёт при старте
  updateResult();
}

/**
 * === Обновляет результат и рисует круг ===
 */
function updateResult() {
  const ac = document.getElementById("aircraftSelect").value;
  const { takeoff, range } = aircraftData[ac];

  const temp = parseInt(document.getElementById("tempSlider").value);
  const wind = parseInt(document.getElementById("windSlider").value);
  const load = parseFloat(document.getElementById("loadSelect").value);
  const runwayLength = getRunwayLength();

  // Поправка на температуру
  const tempPenalty = Math.max(0, temp - 15) * 0.01 / 3;
  const takeoffAdjusted = takeoff * (1 + tempPenalty);

  // Поправка на ветер
  const windFactor = wind * 0.01 / 2;
  const takeoffFinal = takeoffAdjusted * (1 - windFactor);

  // Реальная дальность
  const rangeFinal = Math.round(range * load);

  const delta = Math.round(takeoffFinal - runwayLength);
  const resEl = document.getElementById("result");

  if (delta <= 0) {
    resEl.innerHTML = `✔ <span class="ok">Полоса подходит</span> (запас ${Math.abs(delta)} м).<br>Дальность ≈ ${rangeFinal} км.`;
  } else {
    resEl.innerHTML = `✘ <span class="fail">Не хватает ${delta} м</span>; нужно ≥ ${Math.round(takeoffFinal)} м.<br>После удлинения: дальность ≈ ${rangeFinal} км.`;
  }

  drawRangeCircle(rangeFinal, delta <= 0);
}

/**
 * === Отрисовка круга радиуса дальности ===
 */
function drawRangeCircle(rangeKm, canOperateNow) {
  if (rangeCircle) rangeCircle.setMap(null); // удалить предыдущий

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
