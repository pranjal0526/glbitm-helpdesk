const ApiError = require("./apiError");

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const getString = (value, fieldName, options = {}) => {
  const { min = 1, max, optional = false } = options;

  if (value === undefined || value === null || value === "") {
    if (optional) {
      return undefined;
    }

    throw new ApiError(400, `${fieldName} is required.`);
  }

  if (typeof value !== "string") {
    throw new ApiError(400, `${fieldName} must be a string.`);
  }

  const trimmed = value.trim();

  if (!trimmed) {
    if (optional) {
      return undefined;
    }

    throw new ApiError(400, `${fieldName} cannot be empty.`);
  }

  if (trimmed.length < min) {
    throw new ApiError(
      400,
      `${fieldName} must be at least ${min} characters long.`
    );
  }

  if (max && trimmed.length > max) {
    throw new ApiError(
      400,
      `${fieldName} must be at most ${max} characters long.`
    );
  }

  return trimmed;
};

const getEnumValue = (value, fieldName, allowedValues) => {
  const normalized = getString(value, fieldName).toLowerCase();

  if (!allowedValues.includes(normalized)) {
    throw new ApiError(
      400,
      `${fieldName} must be one of: ${allowedValues.join(", ")}.`
    );
  }

  return normalized;
};

module.exports = {
  getEnumValue,
  getString,
  normalizeEmail,
};

