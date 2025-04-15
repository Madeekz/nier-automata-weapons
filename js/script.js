<!-- js/script.js -->
let weapons = [];
const listEl = document.getElementById('weaponList');
const hideCollected = document.getElementById('hideCollected');

fetch('data/weapons.json')
  .then(r => r.json())
  .then(data => { weapons = data; render(); });

document.getElementById('search').addEventListener('input', render);
document.getElementById('typeFilter').addEventListener('change', render);
document.getElementById('routeFilter').addEventListener('change', render);
hideCollected.addEventListener('change', render);

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
        <label><input type="checkbox" ${isCollected(w.name) ? 'checked' : ''} onchange="toggleCollected('${w.name}', this.checked)"> ${w.name}</label>
        <div><em>Type:</em> ${w.type}</div>
        <div><em>Route:</em> ${w.route}</div>
        <div><em>How to Obtain:</em> ${w.detailedLocation}</div>
        ${w.missable ? '<div style="color:red">⚠ Missable</div>' : ''}
        ${w.scanner ? '<div style="color:teal">🔍 Requires Scanner</div>' : ''}
        <button onclick="toggleDetails(this)">More Info</button>
        <div class="details">${w.extraDetails}</div>
      `;
      listEl.appendChild(div);
    });
}

function toggleView() {
  listEl.classList.toggle('grid-view');
  listEl.classList.toggle('list-view');
}

function toggleCollected(name, checked) {
  localStorage.setItem(`weapon-${name}`, checked);
  render();
}

function isCollected(name) {
  return localStorage.getItem(`weapon-${name}`) === 'true';
}

function toggleDetails(button) {
  const container = button.parentElement;
  container.classList.toggle('expanded');
}
