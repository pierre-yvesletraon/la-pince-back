import validator from "validator";
import mailchecker from "mailchecker";
import dns from "node:dns/promises";

/**
 * Checks if a value is a positive integer.
 * 
 * @param {string} value - The value to check.
 * @returns {boolean} True if the value is a positive integer, otherwise false.
 */
export function isPositiveInteger(value) {
  return /^\d+$/.test(value);
}

/**
 * Validates the format, legitimacy, and domain of an email address.
 *
 * Checks:
 * - Format validity
 * - Disposable/temporary email detection
 * - Existence of the domain and its ability to receive emails (via MX records).
 *
 * @param {string} email - The email address to validate.
 * @returns {Promise<string>} The cleaned and validated email.
 * @throws {Error} Throws a 400 error with detailed messages if the email is invalid.
 */
export async function validateEmail(email) {
  const details = [];

  // Vérifie la forme générale
  if (!validator.isEmail(email)) {
    details.push("Problème avec le format de l'email.");
  }

  // Vérifie si l'email est temporaire/jetable
  if (!mailchecker.isValid(email)) {
    details.push("Email jetable ou temporaire non autorisé.");
  }

  // Vérifie que le domaine existe et a des enregistrements MX
  const domain = email.split("@")[1];

  try {
    // MX = Mail Exchange
    const mxRecords = await dns.resolveMx(domain);

    if (!mxRecords || mxRecords.length === 0) {
      details.push("Le domaine de l'email existe mais ne peut pas recevoir d'e-mails.");
    }

  } catch (error) {
    // Erreur DNS : "ENOTFOUND" - la méthode resolveMx retourne une exception si le domaine n'existe pas
    void error; // utilisation de l'error en void pour éviter les soucis de linter et spécifié qu'elle n'est pas utilisée
    details.push("Le domaine de l'email est invalide ou inexistant.");
  }

  // Si au moins une erreur, on construit une erreur enrichie
  if (details.length > 0) {
    const error = new Error("Email invalide");
    error.statusCode = 400;
    error.details = details;
    throw error;
  }

  // Email valide : on le normalise
  return email.trim().toLowerCase();
}

/**
 * Checks if the password meets the minimum length requirement.
 * 
 * @param {string} password - The password to check.
 * @param {string[]} details - The array to store error messages.
 */
function checkPasswordLength(password, details) {
  if (password.length < 8) {
    details.push("Le mot de passe doit comporter au moins 8 caractères.");
  }
}

/**
 * Checks if the password contains at least one lowercase letter.
 * 
 * @param {string} password - The password to check.
 * @param {string[]} details - The array to store error messages.
 */
function checkPasswordLowercase(password, details) {
  if (!/[a-z]/.test(password)) {
    details.push("Le mot de passe doit contenir au moins une minuscule.");
  }
}

/**
 * Checks if the password contains at least one uppercase letter.
 * 
 * @param {string} password - The password to check.
 * @param {string[]} details - The array to store error messages.
 */
function checkPasswordUppercase(password, details) {
  if (!/[A-Z]/.test(password)) {
    details.push("Le mot de passe doit contenir au moins une majuscule.");
  }
}

/**
 * Checks if the password contains at least one number.
 * 
 * @param {string} password - The password to check.
 * @param {string[]} details - The array to store error messages.
 */
function checkPasswordNumber(password, details) {
  if (!/[0-9]/.test(password)) {
    details.push("Le mot de passe doit contenir au moins un chiffre.");
  }
}

/**
 * Checks if the password contains at least one symbol.
 * 
 * @param {string} password - The password to check.
 * @param {string[]} details - The array to store error messages.
 */
function checkPasswordSymbol(password, details) {
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    details.push("Le mot de passe doit contenir au moins un symbole.");
  }
}

/**
 * Validates a password against multiple security rules:
 * - Minimum length of 8 characters
 * - At least one lowercase letter
 * - At least one uppercase letter
 * - At least one number
 * - At least one symbol
 *
 * If any condition fails, an error is thrown with a list of messages.
 *
 * @param {string} password - The password to validate.
 * @returns {string} The validated password.
 * @throws {Error} Throws a 400 error with detailed messages if the password is invalid.
 */
export function validatePassword(password) {
  const details = [];

  if (typeof password !== "string") {
    details.push("Le mot de passe doit être une chaîne de caractères.");
  }

  checkPasswordLength(password, details);
  checkPasswordLowercase(password, details);
  checkPasswordUppercase(password, details);
  checkPasswordNumber(password, details);
  checkPasswordSymbol(password, details);

  if (details.length > 0) {
    const error = new Error("Mot de passe invalide");
    error.statusCode = 400;
    error.details = details;
    throw error;
  }

  return password;
}
