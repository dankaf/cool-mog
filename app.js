const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

const pointsEl = document.getElementById('points');
let points = parseInt(localStorage.getItem('points') || '0');
pointsEl.textContent = points;

function savePoints() {
    localStorage.setItem('points', points);
    pointsEl.textContent = points;
}

function loadItems() {
    try {
        return JSON.parse(localStorage.getItem('items') || '[]');
    } catch (e) {
        return [];
    }
}

function saveItems(items) {
    localStorage.setItem('items', JSON.stringify(items));
}

function addItemMarker(item) {
    const marker = L.marker([item.lat, item.lng]).addTo(map);
    marker.bindPopup(`<b>${item.description}</b><br><button data-id="${item.id}">Pick Up</button>`);
    marker.on('popupopen', () => {
        const btn = marker.getPopup().getElement().querySelector('button');
        btn.addEventListener('click', () => pickupItem(item.id, marker));
    });
}

function renderItems() {
    const items = loadItems();
    items.forEach(addItemMarker);
}

function pickupItem(id, marker) {
    let items = loadItems();
    items = items.filter(i => i.id !== id);
    saveItems(items);
    map.removeLayer(marker);
    points += 10;
    savePoints();
}

renderItems();

const form = document.getElementById('itemForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = document.getElementById('description').value.trim();
    const lat = parseFloat(document.getElementById('lat').value);
    const lng = parseFloat(document.getElementById('lng').value);
    const item = { id: Date.now(), description, lat, lng };
    const items = loadItems();
    items.push(item);
    saveItems(items);
    addItemMarker(item);
    form.reset();
});

map.on('click', (e) => {
    document.getElementById('lat').value = e.latlng.lat.toFixed(6);
    document.getElementById('lng').value = e.latlng.lng.toFixed(6);
});
