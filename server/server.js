const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on("connection", (socket) => {
  socket.on("join", (name) => {
    socket.username = name;
    io.emit("message", { user: "Server", text: `${name} chatga qo'shildi`});
  });

  socket.on("sendMessage", (message) => {
    io.emit("message", { user: socket.username, text: message });
  });

  socket.on("disconnect", () => {
    io.emit("message", { user: "Server", text: `${socket.username} chatni tark etdi`})
  });
});

server.listen(3000, () => console.log("Server is running on port 3000"))