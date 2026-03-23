const mongoose = require("mongoose");

const env = require("./env");

let cachedConnection = null;
let connectionPromise = null;

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (cachedConnection) {
    return cachedConnection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((connection) => {
        console.log(`MongoDB connected: ${connection.connection.host}`);
        cachedConnection = connection;
        return connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
};

module.exports = connectDB;
