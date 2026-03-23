require("dotenv").config();

const parseCsvList = (...values) => {
  const entries = values
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set(entries)];
};

const port = Number(process.env.PORT || 5000);

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number.isNaN(port) ? 5000 : port,
  MONGODB_URI: process.env.MONGODB_URI,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  ADMIN_CHALLENGE_EXPIRES_IN:
    process.env.ADMIN_CHALLENGE_EXPIRES_IN || "10m",
  CLIENT_ORIGINS: parseCsvList(
    process.env.CLIENT_ORIGINS,
    process.env.CLIENT_ORIGIN
  ),
  ALLOWED_EMAIL_DOMAINS: parseCsvList(
    process.env.ALLOWED_EMAIL_DOMAINS,
    process.env.ALLOWED_EMAIL_DOMAIN
  ),
  ALLOWED_EMAILS: parseCsvList(
    process.env.ALLOWED_EMAILS,
    process.env.ALLOWED_EMAIL_WHITELIST
  ),
  ADMIN_EMAILS: parseCsvList(process.env.ADMIN_EMAILS),
  ADMIN_ACCESS_CODE: (process.env.ADMIN_ACCESS_CODE || "").trim(),
};

const missingVariables = ["MONGODB_URI", "GOOGLE_CLIENT_ID", "JWT_SECRET"].filter(
  (key) => !env[key]
);

if (missingVariables.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVariables.join(", ")}`
  );
}

if (
  env.ALLOWED_EMAIL_DOMAINS.length === 0 &&
  env.ALLOWED_EMAILS.length === 0
) {
  throw new Error(
    "Set ALLOWED_EMAIL_DOMAINS or ALLOWED_EMAILS to restrict who can log in."
  );
}

module.exports = Object.freeze(env);
