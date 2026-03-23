require("dotenv").config();

const http = require("http");
const mongoose = require("mongoose");

const app = require("./src/app");
const connectDB = require("./src/config/db");
const env = require("./src/config/env");

const server = http.createServer(app);

let isShuttingDown = false;

const shutdown = async (signal) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`${signal} received. Shutting down gracefully...`);

  const closeDatabaseConnection = async () => {
    try {
      await mongoose.connection.close(false);
      console.log("MongoDB connection closed.");
    } catch (error) {
      console.error("Error while closing MongoDB connection:", error);
    }
  };

  if (server.listening) {
    server.close(async () => {
      await closeDatabaseConnection();
      process.exit(0);
    });
  } else {
    await closeDatabaseConnection();
    process.exit(0);
  }

  setTimeout(async () => {
    try {
      await mongoose.connection.close(false);
    } catch (error) {
      console.error("Forced shutdown failed to close MongoDB cleanly:", error);
    }

    process.exit(1);
  }, 10000).unref();
};

const startServer = async () => {
  await connectDB();

  server.listen(env.PORT, () => {
    console.log(`Backend server is running on port ${env.PORT}`);
  });
};

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
