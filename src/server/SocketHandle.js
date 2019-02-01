var Query = require("./Query");

const connectionHandle = socket => {
  Query.createPrivateRoom(
    socket.handshake.query.to,
    socket.handshake.query.sender
  )
    .then(room => {
      socket.join(room);

      //Video chat
      socket.on("offer", msg => socket.to(room).emit("offer", msg));
      socket.on("candidate", msg => socket.to(room).emit("candidate", msg));
      socket.on("answer", msg => socket.to(room).emit("answer", msg));
      socket.on("leave", msg => socket.to(room).emit("leave", msg));

      //text chat
      socket.on("message", msg => socket.to(room).emit("message", msg));
    })
    .catch(err => console.log(err));
};

module.exports = connectionHandle;
