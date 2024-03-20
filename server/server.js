const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { stopAllCronJobs, startCronJob, stopCronJob } = require("./cron");

const PORT = process.env.PORT || 3005;
const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3004",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);

    console.log(`User ${socket.id} joined room ${roomId}`);

    startCronJob(roomId, io);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    socket.disconnect();

    console.log(`User ${socket.id} left room ${roomId}`);

    stopCronJob(roomId);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  stopAllCronJobs();
  process.exit(0);
});
