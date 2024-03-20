const express = require("express");
const http = require("http");
const cors = require("cors");
const { socketManager } = require("./socket");
const { stopAllCronJobs } = require("./cron");

const PORT = process.env.PORT || 3005;
const app = express();

app.use(cors());

const server = http.createServer(app);

socketManager(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  stopAllCronJobs();
  process.exit(0);
});
