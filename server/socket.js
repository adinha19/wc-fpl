const { Server } = require("socket.io");
const { startCronJob, stopCronJob } = require("./cron");

const socketManager = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3004",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", async (roomId) => {
      console.log(`User joined room ${roomId}`);

      socket.join(roomId);

      startCronJob(roomId, io);
    });

    socket.on("leaveRoom", (roomId) => {
      console.log(`User left room ${roomId}`);
      socket.leave(roomId);
      stopCronJob(roomId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = {
  socketManager,
};
