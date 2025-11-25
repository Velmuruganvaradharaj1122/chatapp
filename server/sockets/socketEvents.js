const onlineUsers = {};

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', ({ userId }) => {
      onlineUsers[socket.id] = userId;
      io.emit('onlineUsers', Object.values(onlineUsers));
    });

    socket.on('sendMessage', (data) => {
      io.emit('newMessage', data);
    });

    socket.on('typing', ({ receiverId, senderName }) => {
      socket.to(receiverId).emit('typing', senderName);
    });

    socket.on('disconnect', () => {
      delete onlineUsers[socket.id];
      io.emit('onlineUsers', Object.values(onlineUsers));
    });
  });
};

module.exports = setupSocket;