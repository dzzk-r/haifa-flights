// === main.js ===
import { initMap, drawRangeCircle } from './map.js';
import { aircraftGroups } from './aircraft-data.js';


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

function updateResult() {
  const group = document.getElementById("categorySelect").value;
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

// === Запуск после загрузки карты ===
window.initMap = () => {
  initMap(() => {
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
  });
};
