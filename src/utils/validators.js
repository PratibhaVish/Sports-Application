/**
 * validators.js
 * Pure validation helpers — no side effects.
 */

/**
 * Validate new-database form fields.
 * Returns an object whose keys are field names and values are error strings.
 */
export const validateCreateDBForm = ({ name, masterPassword, password }) => {
  const errors = {};

  if (!name || name.trim().length === 0) {
    errors.name = 'Database name is required.';
  } else if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    errors.name = 'Only letters, numbers, hyphens, and underscores allowed.';
  } else if (name.length > 63) {
    errors.name = 'Database name must be 63 characters or fewer.';
  }

  if (!masterPassword || masterPassword.trim().length === 0) {
    errors.masterPassword = 'Master password is required.';
  }

  if (!password || password.length < 6) {
    errors.password = 'Admin password must be at least 6 characters.';
  }

  return errors;
};

/**
 * Validate login form fields.
 */
export const validateLoginForm = ({ db, login, password }) => {
  const errors = {};
  if (!db || db.trim().length === 0)       errors.db       = 'Database name is required.';
  if (!login || login.trim().length === 0) errors.login    = 'Username is required.';
  if (!password || password.length === 0)  errors.password = 'Password is required.';
  return errors;
};

/**
 * Returns true when an error-map object has zero keys (i.e. no errors).
 */
export const isValid = (errors) => Object.keys(errors).length === 0;
