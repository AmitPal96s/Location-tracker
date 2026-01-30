const socket = io();

console.log("script.js loaded");

// Leaflet map
const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "PalNiwas",
}).addTo(map);

// Markers store
const markers = {};
let isFirstLocation = true;

// Geolocation
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      socket.emit("sendLocation", {
        latitude,
        longitude,
      });
    },
    (error) => {
      console.error("Geolocation error:", error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
}

// Receive location updates
socket.on("receiveLocation", (data) => {
  const { id, latitude, longitude } = data;

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }

  // Center only once
  if (isFirstLocation) {
    map.setView([latitude, longitude], 15);
    isFirstLocation = false;
  }

  // Optional: fit all markers
  const group = L.featureGroup(Object.values(markers));
  map.fitBounds(group.getBounds(), { padding: [50, 50] });
});

// Handle disconnect
socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
