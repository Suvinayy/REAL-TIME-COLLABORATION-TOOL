const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let sharedContent = ""; // shared doc content

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send current content to new client
  socket.emit('init', sharedContent);

  // When user types
  socket.on('text-change', (data) => {
    sharedContent = data;
    socket.broadcast.emit('text-change', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Collaboration server running at http://localhost:${PORT}`);
});
