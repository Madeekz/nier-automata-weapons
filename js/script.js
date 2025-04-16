let weapons = [];

const trophyData = [
  {
    name: "Weapons Master",
    description: "Fully upgrade all weapons.",
    missable: true,
    tip: "Requires finding and upgrading all 40+ weapons. Missable weapons include 'Cruel Oath', 'Iron Pipe', and 'Faith'. Do this before progressing too far into Route C.",
  },
  {
    name: "Pod Hunter",
    description: "Find all Pods.",
    missable: false,
    tip: "There are three Pods in total. One is buried in the desert (requires Scanner). Others are found in the Flooded City and bought from vendors.",
  },
  {
    name: "The Minds That Emerged",
    description: "View all endings.",
    missable: false,
    tip: "There are 26 endings (A-Z). Most are easy, some are joke endings. Make a manual save after Ending C to get all the rest quickly.",
  },
  {
    name: "Fighting Words",
    description: "Play a 2B vs. A2 boss fight with only bare fists.",
    missable: true,
    tip: "Unequip all weapons before the 2B vs. A2 boss fight. If you win using only punches, you unlock this hidden trophy.",
  },
  {
    name: "What Are You Doing?",
    description: "Look under 2B’s skirt 10 times.",
    missable: false,
    tip: "Use the camera angle while idle or fallen down to peek. Do this 10 times and the trophy unlocks. 😳",
  }
];

const listEl = document.getElementById('weaponList');
const hideCollected = document.getElementById('hideCollected');

// JSON laden
fetch('data/weapons.json')
  .then(r => r.json())
  .then(data => {
    weapons = data;
    render();
    updateProgress(); // Fortschritt direkt beim Laden berechnen
  });

// Filter-Events
document.getElementById('search').addEventListener('input', render);
document.getElementById('typeFilter').addEventListener('change', render);
document.getElementById('routeFilter').addEventListener('change', render);
hideCollected.addEventListener('change', render);

// Waffen-Rendering
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

// Speichern / Laden
function toggleCollected(name, checked) {
  localStorage.setItem(`weapon-${name}`, checked);
  render();
}

function isCollected(name) {
  return localStorage.getItem(`weapon-${name}`) === 'true';
}

// Details ein-/ausblenden
function toggleDetails(button) {
  const container = button.parentElement;
  container.classList.toggle('expanded');
}

// Ansicht wechseln (Liste / Grid)
function toggleView() {
  listEl.classList.toggle('grid-view');
  listEl.classList.toggle('list-view');
}

// Fortschrittsanzeige aktualisieren
function updateProgress() {
  const collected = weapons.filter(w => isCollected(w.name)).length;
  const total = weapons.length;
  const percent = Math.round((collected / total) * 100);

  document.getElementById("progressText").textContent =
    `${collected} / ${total} Weapons collected (${percent}%)`;
  document.getElementById("progressBar").style.width = `${percent}%`;
}

// Tabs anzeigen
function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
    tab.style.display = 'none';
  });

  const activeTab = document.getElementById('tab-' + id);
  if (activeTab) {
    activeTab.classList.add('active');
    activeTab.style.display = 'block';
  }

  if (id === "trophies") {
    renderTrophies();
  }
}

// Trophäen anzeigen
function renderTrophies() {
  const list = document.getElementById("trophyList");
  list.innerHTML = "";

  trophyData.forEach(trophy => {
    const div = document.createElement("div");
    div.className = "weapon";

    div.innerHTML = `
      <strong>🏆 ${trophy.name}</strong><br/>
      <em>${trophy.description}</em><br/>
      ${trophy.missable ? '<div class="missable">⚠ Missable</div>' : ''}
      <div style="margin-top:0.5rem;"><strong>Tips:</strong><br/>${trophy.tip}</div>
    `;

    list.appendChild(div);
  });
}

// Startansicht
showTab('weapons');
