const googleClient = require("../config/google");
const env = require("../config/env");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const { isEmailAllowed, resolveUserRole } = require("../utils/accessControl");
const {
  generateAdminChallengeToken,
  generateToken,
  verifyToken,
} = require("../utils/jwt");
const { getString, normalizeEmail } = require("../utils/validators");

const googleLogin = asyncHandler(async (req, res) => {
  const credential =
    req.body.credential || req.body.token || req.body.idToken || "";

  if (!credential || typeof credential !== "string") {
    throw new ApiError(400, "Google credential token is required.");
  }

  let ticket;

  try {
    ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });
  } catch (error) {
    throw new ApiError(401, "Invalid Google credential token.");
  }

  const payload = ticket.getPayload();

  if (!payload || !payload.email) {
    throw new ApiError(401, "Unable to verify Google account.");
  }

  if (!payload.email_verified) {
    throw new ApiError(401, "Google account email is not verified.");
  }

  const email = normalizeEmail(payload.email);

  if (!isEmailAllowed(email)) {
    throw new ApiError(
      403,
      "This Google account is not authorized for this application."
    );
  }

  let user = await User.findOne({ email });
  const role = resolveUserRole(email, user?.role);

  if (!user) {
    user = await User.create({
      name: payload.name || email.split("@")[0],
      email,
      role,
      profilePicture: payload.picture || "",
    });
  } else {
    user.name = payload.name || user.name;
    user.profilePicture = payload.picture || user.profilePicture;
    user.role = role;
    await user.save();
  }

  if (user.role === "admin") {
    return res.status(200).json({
      success: true,
      message: "Google account verified. Admin access code required.",
      requiresAdminCode: true,
      challengeToken: generateAdminChallengeToken(user),
      user,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Login successful.",
    token: generateToken(user),
    user,
  });
});

const verifyAdminAccessCode = asyncHandler(async (req, res) => {
  const challengeToken = getString(
    req.body.challengeToken,
    "challengeToken",
    {
      min: 10,
      max: 2000,
    }
  );
  const accessCode = getString(req.body.accessCode, "accessCode", {
    min: 3,
    max: 200,
  });

  if (!env.ADMIN_ACCESS_CODE) {
    throw new ApiError(
      500,
      "Admin access code is not configured on the server."
    );
  }

  let decodedToken;

  try {
    decodedToken = verifyToken(challengeToken);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired admin verification session.");
  }

  if (
    decodedToken.type !== "admin-challenge" ||
    decodedToken.role !== "admin"
  ) {
    throw new ApiError(401, "Invalid admin verification session.");
  }

  if (accessCode !== env.ADMIN_ACCESS_CODE) {
    throw new ApiError(401, "Invalid admin access code.");
  }

  const user = await User.findById(decodedToken.sub);

  if (!user || user.role !== "admin") {
    throw new ApiError(401, "Admin account no longer exists.");
  }

  return res.status(200).json({
    success: true,
    message: "Admin verification successful.",
    token: generateToken(user),
    user,
  });
});

module.exports = {
  googleLogin,
  verifyAdminAccessCode,
};
