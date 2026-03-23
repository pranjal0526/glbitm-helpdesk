const express = require("express");
const cors = require("cors");

const env = require("./config/env");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const complaintRoutes = require("./routes/complaint.routes");
const ApiError = require("./utils/apiError");
const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/error.middleware");

const app = express();

app.disable("x-powered-by");

const corsOptions =
  env.CLIENT_ORIGINS.length === 0
    ? {
        origin: true,
        credentials: true,
      }
    : {
        origin(origin, callback) {
          if (!origin || env.CLIENT_ORIGINS.includes(origin.toLowerCase())) {
            return callback(null, true);
          }

          return callback(
            new ApiError(403, "Origin is not allowed by the CORS policy.")
          );
        },
        credentials: true,
      };

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "College complaint backend is running.",
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy.",
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/complaints", complaintRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
