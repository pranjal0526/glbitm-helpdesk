const ApiError = require("../utils/apiError");
const env = require("../config/env");

const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let normalizedError = error;

  if (!(normalizedError instanceof ApiError)) {
    if (normalizedError.name === "ValidationError") {
      normalizedError = new ApiError(400, normalizedError.message);
    } else if (normalizedError.name === "CastError") {
      normalizedError = new ApiError(400, "Invalid resource identifier.");
    } else if (normalizedError.code === 11000) {
      const duplicatedField = Object.keys(normalizedError.keyValue || {})[0];
      normalizedError = new ApiError(
        409,
        `${duplicatedField || "Resource"} already exists.`
      );
    } else if (normalizedError instanceof SyntaxError && "body" in normalizedError) {
      normalizedError = new ApiError(400, "Invalid JSON payload.");
    } else {
      normalizedError = new ApiError(500, "Internal server error.");
    }
  }

  if (normalizedError.statusCode >= 500) {
    console.error(normalizedError);
  }

  const responseBody = {
    success: false,
    message: normalizedError.message,
  };

  if (normalizedError.details) {
    responseBody.details = normalizedError.details;
  }

  if (env.NODE_ENV !== "production") {
    responseBody.stack = normalizedError.stack;
  }

  return res.status(normalizedError.statusCode).json(responseBody);
};

module.exports = {
  errorHandler,
  notFoundHandler,
};

