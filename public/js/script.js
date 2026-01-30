const socket = io();

console.log('script.js loaded');

// Geolocation
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            socket.emit('sendLocation', {
                latitude,
                longitude
            });
        },
        (error) => {
            console.error('Geolocation error:', error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
        }
    );
}

// Leaflet map
const map = L.map('map').setView([0, 0], 18);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'PalNiwas',
}).addTo(map);

// Markers store
const markers = {};

// Receive location updates
socket.on('receiveLocation', (data) => {
    const { id, latitude, longitude } = data;

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }

    map.setView([latitude, longitude], 15);
});

socket.on('User-disconnected:', (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }  
});


