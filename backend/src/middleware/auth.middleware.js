const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const { verifyToken } = require("../utils/jwt");

const authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication token is required.");
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    throw new ApiError(401, "Authentication token is required.");
  }

  let decodedToken;

  try {
    decodedToken = verifyToken(token);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired authentication token.");
  }

  if (decodedToken.type !== "session") {
    throw new ApiError(401, "This token cannot be used for authenticated API access.");
  }

  const user = await User.findById(decodedToken.sub);

  if (!user) {
    throw new ApiError(401, "User account no longer exists.");
  }

  req.user = user;
  next();
});

module.exports = authenticate;
