const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

// View engine & static files
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Create server & socket.io
const server = http.createServer(app);
const io = socketio(server);

// Socket.io logic
io.on("connection", (socket) => {
  console.log("New WebSocket connection:", socket.id);

  socket.on("sendLocation", (data) => {
    io.emit("receiveLocation", {
      id: socket.id,
      latitude: data.latitude,
      longitude: data.longitude,
    });
  });

  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
  });
});

// Routes
app.get("/", (req, res) => {
  res.render("index");
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
