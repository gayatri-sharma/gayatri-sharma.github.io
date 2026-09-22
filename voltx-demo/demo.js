const scenarios = [
  [0.55, 0.54, 0.48, 0.34, 0.45],
  [0.50, 0.48, 0.44, 0.39, 0.53],
];
const stations = [
  { name: 'Central Plaza Supercharger', distance: 0.3, available: 3, total: 8 },
  { name: 'Market Square Supercharger', distance: 1.1, available: 6, total: 12 },
  { name: 'Riverside Supercharger', distance: 1.8, available: 5, total: 12 },
  { name: 'Oak Grove Supercharger', distance: 2.4, available: 8, total: 16 },
  { name: 'West Park Supercharger', distance: 2.9, available: 4, total: 8 },
];
let scenario = 0;
let sortByPrice = false;
const priceLabel = rate => rate <= 0.45 ? ['Low', 'lower', '↓'] : rate <= 0.50 ? ['Medium', 'medium', '—'] : ['High', 'higher', '↑'];
const currentStations = () => stations.map((station, i) => ({ ...station, rate: scenarios[scenario][i] }));
function render() {
  const items = currentStations().sort((a, b) => sortByPrice ? a.rate - b.rate : a.distance - b.distance);
  document.querySelector('#chargers').replaceChildren(...items.map((station, i) => {
    const [label, color, icon] = priceLabel(station.rate);
    const li = document.createElement('li');
    li.innerHTML = `<span class="number">${String(i + 1).padStart(2, '0')}</span><div><strong>${station.name}</strong><small>$${station.rate.toFixed(2)}/kWh · Sample rate</small><small>Available: ${station.available} of ${station.total} stalls</small></div><span class="pricing-badge ${color}" aria-label="${label} sample price"><span aria-hidden="true">${icon}</span><span>${label}</span></span><span class="distance">${station.distance.toFixed(1)} mi</span>`;
    return li;
  }));
}
document.querySelector('#refresh').addEventListener('click', () => {
  scenario = (scenario + 1) % scenarios.length;
  document.querySelector('#battery').textContent = scenario ? '59%' : '62%';
  document.querySelector('#updated').textContent = `Sample refreshed ${new Date().toLocaleTimeString()}`;
  document.querySelector('#alert-preview').hidden = true;
  render();
});
document.querySelector('#sort').addEventListener('click', event => {
  sortByPrice = !sortByPrice;
  event.currentTarget.textContent = sortByPrice ? 'Sort by nearest' : 'Sort by lowest price';
  render();
});
document.querySelector('#alert').addEventListener('click', () => {
  const cheapest = currentStations().sort((a, b) => a.rate - b.rate)[0];
  const preview = document.querySelector('#alert-preview');
  preview.textContent = `Demo alert: ${cheapest.name} has the lowest sample rate — $${cheapest.rate.toFixed(2)}/kWh, ${cheapest.distance.toFixed(1)} miles away. This is a preview, not a live push notification.`;
  preview.hidden = false;
});
render();
