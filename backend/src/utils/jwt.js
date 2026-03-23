const jwt = require("jsonwebtoken");

const env = require("../config/env");

const signToken = (payload, expiresIn) =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn,
  });

const generateToken = (user) =>
  signToken(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      type: "session",
    },
    env.JWT_EXPIRES_IN
  );

const generateAdminChallengeToken = (user) =>
  signToken(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      type: "admin-challenge",
    },
    env.ADMIN_CHALLENGE_EXPIRES_IN
  );

const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET);

module.exports = {
  generateAdminChallengeToken,
  generateToken,
  verifyToken,
};
