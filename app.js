const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

// View engine & static files
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Create server & socket.io
const server = http.createServer(app);
const io = socketio(server);

// Socket.io logic
io.on('connection', (socket) => {
    console.log('New WebSocket connection:', socket.id);

    socket.on('sendLocation', (data) => {
        io.emit('receiveLocation', {
            id: socket.id,
            latitude: data.latitude,
            longitude: data.longitude
        });

    
    });

    socket.on('disconnect', (id) => {
        io.emit('User-disconnected:', socket.id);
    });
});

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

// IMPORTANT: listen on server, not app
server.listen(3000, () => {
    console.log('Server running on port 3000');
});
