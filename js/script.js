let weapons = [];
const listEl = document.getElementById('weaponList');
fetch('data/weapons.json')
  .then(r => r.json())
  .then(data => { weapons = data; render(); });

document.getElementById('search').addEventListener('input', render);
document.getElementById('typeFilter').addEventListener('change', render);

function render() {
  const search = document.getElementById('search').value.toLowerCase();
  const filter = document.getElementById('typeFilter').value;
  listEl.innerHTML = '';
  weapons
    .filter(w => w.name.toLowerCase().includes(search))
    .filter(w => filter === 'all' || w.type === filter)
    .forEach(w => {
      const div = document.createElement('div');
      div.className = 'weapon';
      div.innerHTML = `
        <strong>${w.name}</strong> (${w.type})<br>
        <small>${w.location}</small><br>
        ${w.missable ? '<span style="color:red">⚠ Missable</span><br>' : ''}
        ${w.scanner ? '<span style="color:teal">🔍 Requires Scanner</span><br>' : ''}
        ${w.mapLink ? `<button onclick="window.open('${w.mapLink}', '_blank')">🗺 View on Map</button>` : ''}
        ${w.videoLink ? `<button onclick="window.open('${w.videoLink}', '_blank')">▶ Watch Video</button>` : ''}
      `;
      listEl.appendChild(div);
    });
}

function toggleView() {
  listEl.classList.toggle('grid-view');
  listEl.classList.toggle('list-view');
}
