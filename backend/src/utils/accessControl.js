const env = require("../config/env");
const { normalizeEmail } = require("./validators");

const getDomain = (email) => {
  const normalized = normalizeEmail(email);
  return normalized.split("@")[1] || "";
};

const isEmailAllowed = (email) => {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    return false;
  }

  return (
    env.ALLOWED_EMAILS.includes(normalized) ||
    env.ALLOWED_EMAIL_DOMAINS.includes(getDomain(normalized))
  );
};

const resolveUserRole = (email, currentRole) => {
  const normalized = normalizeEmail(email);

  if (currentRole === "admin") {
    return "admin";
  }

  if (env.ADMIN_EMAILS.includes(normalized)) {
    return "admin";
  }

  return currentRole || "student";
};

module.exports = {
  isEmailAllowed,
  resolveUserRole,
};

