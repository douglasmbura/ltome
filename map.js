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

// Google Sheets JSON URL (replace with your sheet's ID)
const googleSheetsURL = 'https://spreadsheets.google.com/feeds/list/1ryLjtHvrQu16cWI39Ut1mKxlAzhIBHNVEh6dsAi7jos/od6/public/values?alt=json';

// Fetch data from Google Sheets and add markers
fetch(googleSheetsURL)
  .then(response => response.json())
  .then(data => {
    const entries = data.feed.entry;
    
    entries.forEach((row, index) => {
      // Extract relevant data from Google Sheets JSON format
      const lat = parseFloat(row.gsx$latitude.$t);
      const lng = parseFloat(row.gsx$longitude.$t);
      const siteName = row.gsx$site_name.$t;
      const soundLabel = row.gsx$sound_label.$t;
      const audioUrl = row.gsx$audio.$t;
      const photoUrl = row.gsx$photo.$t;
      const markerImg = row.gsx$marker.$t;

      // Skip rows with invalid coordinates
      if (isNaN(lat) || isNaN(lng)) return;

      // Create custom icon if marker image is available
      const icon = L.icon({
        iconUrl: markerImg ? `assets/markers/${markerImg}.png` : 'default-marker.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      // Create marker at the specified location
      const marker = L.marker([lat, lng], { icon }).addTo(map);

      // Set up popup content with image, sound label, and audio player
      const popupContent = `
        <div style="text-align: center;">
          <img src="${photoUrl}" alt="${siteName}" style="width:100px;height:100px;object-fit:cover;border-radius:5px;">
          <h3>${siteName}</h3>
          <p>Sound Label: ${soundLabel}</p>
          <button id="play-${index}">Play Sound</button>
        </div>
      `;
      
      // Bind popup to the marker
      marker.bindPopup(popupContent);

      // Add event listener for the play button within the popup
      marker.on('popupopen', function() {
        const playButton = document.getElementById(`play-${index}`);
        if (playButton) {
          playButton.addEventListener('click', function() {
            playAudio(audioUrl);
          });
        }
      });
    });
  })
  .catch(error => console.error("Error fetching Google Sheets data:", error));

// Function to play audio from provided URL
function playAudio(audioUrl) {
  const audio = new Audio(audioUrl);
  audio.play().catch(error => console.error("Audio playback error:", error));
}
