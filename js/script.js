let weapons = [];
const listEl = document.getElementById('weaponList');
const hideCollected = document.getElementById('hideCollected');

// Lade die JSON-Daten
fetch('data/weapons.json')
  .then(r => r.json())
  .then(data => {
    weapons = data;
    render();
  });

// Event Listener für Filter & Suche
document.getElementById('search').addEventListener('input', render);
document.getElementById('typeFilter').addEventListener('change', render);
document.getElementById('routeFilter').addEventListener('change', render);
hideCollected.addEventListener('change', render);

// Haupt-Renderfunktion
function render() {
  const search = document.getElementById('search').value.toLowerCase();
  const typeFilter = document.getElementById('typeFilter').value;
  const routeFilter = document.getElementById('routeFilter').value;
  listEl.innerHTML = '';

  weapons
    .filter(w => w.name.toLowerCase().includes(search))
    .filter(w => typeFilter === 'all' || w.type === typeFilter)
    .filter(w => routeFilter === 'all' || w.route === routeFilter)
    .filter(w => !hideCollected.checked || !isCollected(w.name))
    .forEach(w => {
      const div = document.createElement('div');
      div.className = 'weapon';
      if (isCollected(w.name)) div.classList.add('collected');

      div.innerHTML = `
        <label>
          <input type="checkbox" ${isCollected(w.name) ? 'checked' : ''} 
                 onchange="toggleCollected('${w.name}', this.checked)">
          ${w.name}
        </label>
        <div><em>Type:</em> ${w.type}</div>
        <div><em>Route:</em> ${w.route}</div>
        <div><em>How to Obtain:</em> ${w.detailedLocation}</div>
        ${w.missable ? '<div class="missable">⚠ Missable</div>' : ''}
        ${w.scanner ? '<div class="scanner">🔍 Requires Scanner</div>' : ''}
        <button onclick="toggleDetails(this)">More Info</button>
        <div class="details">${w.extraDetails}</div>
      `;

      listEl.appendChild(div);
      

    });
  updateProgress();
}

// Speichere Abhaken-Status
function toggleCollected(name, checked) {
  localStorage.setItem(`weapon-${name}`, checked);
  render();
}

// Lese Abhaken-Status
function isCollected(name) {
  return localStorage.getItem(`weapon-${name}`) === 'true';
}

// Zeige/verstecke Detailbeschreibung
function toggleDetails(button) {
  const container = button.parentElement;
  container.classList.toggle('expanded');
}

// Ansicht umschalten
function toggleView() {
  listEl.classList.toggle('grid-view');
  listEl.classList.toggle('list-view');
}
function updateProgress() {
  const collected = weapons.filter(w => isCollected(w.name)).length;
  const total = weapons.length;
  const percent = Math.round((collected / total) * 100);

  document.getElementById("progressText").textContent = `${collected} / ${total} Weapons collected (${percent}%)`;
  document.getElementById("progressBar").style.width = `${percent}%`;
}
