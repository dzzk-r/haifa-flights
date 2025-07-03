import { aircraftGroups } from './aircraftData.js';
import { drawRangeCircle } from './map.js';

export function initUI(updateResult, updateAircraftInfo) {
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
}

// Авто-вызов при загрузке
document.addEventListener('DOMContentLoaded', () => {
  populateAircraftSelects();
});
