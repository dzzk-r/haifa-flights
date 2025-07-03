import { aircraftGroups } from './aircraftData.js';
import { drawRangeCircle, getMap } from './map.js';
import { initUI } from './ui.js';
import { getRunwayLength } from './utils.js';
import { initMap } from './map.js';

function updateAircraftInfo(group, model) {
  const infoEl = document.getElementById("aircraftInfo");
  const aircraft = aircraftGroups[group]?.[model];
  if (!aircraft) return (infoEl.textContent = "");
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
    <img src="img/aircraft/${imageName}" alt="${ac}" style="max-width: 100%; max-height: 120px;">
    <br><br>
    👥 Вместимость: ${capacity || "?"} чел<br><br>
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

document.addEventListener("DOMContentLoaded", () => {
  initUI(updateResult, updateAircraftInfo);
});


window.initMap = initMap;

// Дождись, пока Google Maps загрузится, затем вызови initMap
window.addEventListener('load', () => {
  if (typeof google !== 'undefined' && google.maps) {
    initMap();
  } else {
    console.warn("❌ Google Maps API не загрузился");
  }
});

window.logMapDebug = logMapDebug;
