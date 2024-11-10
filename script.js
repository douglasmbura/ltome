// Initialize the map
const map = L.map('map').setView([0.0, 37.0], 6); // Center coordinates and zoom level

// Add base maps
const baseMaps = {
  "Standard OSM": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map),
  "Satellite": L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', { maxZoom: 19 }),
  "Terrain": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17 }),
  "Weather": L.tileLayer('https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY', { maxZoom: 19 })
};
L.control.layers(baseMaps).addTo(map);

// Load CSV data
Papa.parse("data.csv", {
  download: true,
  header: true,
  complete: function(results) {
    results.data.forEach((row) => {
      // Custom icon
      const icon = L.icon({
        iconUrl: `assets/markers/${row.marker}.png`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      // Create marker
      const marker = L.marker([row.latitude, row.longitude], { icon }).addTo(map);

      // Bind popup with image, sound label, and audio player
      const popupContent = `
        <div style="text-align: center;">
          <img src="assets/${row.photo}" alt="${row['site-name']}" style="width:100px;height:100px;object-fit:cover;border-radius:5px;">
          <h3>${row['site-name']}</h3>
          <p>Sound Label: ${row['sound-label']}</p>
          <button onclick="playAudio('${row.audio}')">Play Sound</button>
        </div>
      `;
      marker.bindPopup(popupContent);
    });
  }
});

// Function to play audio
function playAudio(audioUrl) {
  const audio = new Audio(audioUrl);
  audio.play();
}
