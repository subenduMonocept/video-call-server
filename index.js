import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import { initializeSocket } from "./sockets/index.js";

dotenv.config();

const PORT = process.env.PORT || 3334;

const app = express();
const server = http.createServer(app);

const io = initializeSocket(server);

app.use(cors());

server.listen(PORT, () => {
  console.log(`Server is running on -> http://localhost:${PORT}`);
});

// Graceful shutdown
const shutdown = () => {
  console.log("Shutting down gracefully...");

  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });

  io.close(() => {
    console.log("Socket.IO server closed");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forced shutdown");
    process.exit(1); // failure
  }, 5000);
};

process.on("SIGINT", shutdown); // Ctrl+C
process.on("SIGTERM", shutdown); // Deployment kill signals
