const path = require('path');


module.exports = function(app, express, io) {
  // Socket Events
  // const chat = io.of('/chat'); // declare namespace
  io.on('connection', function(socket) {
    socket.on('room', function(room) {
      socket.join(room.chatRoom);
      socket.join(room.signalRoom);

      io.in(room.signalRoom).emit('joined', {
        author: 'Admin',
        message: 'New client in the ' + room.chatRoom + ' room.'
      });
    });
    socket.on('send', function(data) {
      // For messeging we want to emit the message to everyone including the sender
      io.in(data.room).emit('message', {
        author: data.author,
        message: data.message
      });
    });
    socket.on('signal', function(data) {
      // for signaling we only want to broadcast to other clients
      socket.broadcast.to(data.room).emit('signaling_message', {
        type: data.type,
        message: data.message
      });
    });
  });
  // REST Routes
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/public/index.html'));
  });
}