import { User } from "../models/User.js";
import { hash, verify } from "argon2";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { validateEmail, validatePassword } from "../utils/validators.js";

/**
 * Registers a new user.
 * 
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User successfully registered.
 *       400:
 *         description: Invalid input.
 *       409:
 *         description: Email already in use.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing user data.
 * @param {string} req.body.email - User's email address.
 * @param {string} req.body.password - User's password.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Returns a success message or an error.
 */
export async function registerUser(req, res, next) {
  const { email, password } = req.body;

  const verifiedEmail = await validateEmail(email);
  const verifiedPassword = validatePassword(password);

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    const error = new Error("Adresse e-mail non disponible.");
    error.statusCode = 409;
    error.details = ["L'adresse e-mail est déjà associée à un autre compte."];
    return next(error);
  }

  const hashedPassword = await hash(verifiedPassword, { type: 2 }); // 2 = argon2id || combine argon 2i et argon 2d

  await User.create({ email: verifiedEmail, password: hashedPassword });

  res.status(201).json({ message: "Utilisateur créé avec succès" });
}

/**
 * Logs in an existing user.
 * 
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Invalid credentials.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing login credentials.
 * @param {string} req.body.email - User's email address.
 * @param {string} req.body.password - User's password.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Returns a JWT token or an error.
 */
export async function loginUser(req, res, next) {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email }
  });

  if (!user) {
    const error = new Error("Identifiants invalides.");
    error.statusCode = 401;
    error.details = ["Aucun compte trouvé avec cet e-mail."];
    return next(error);
  }

  const isPasswordValid = await verify(user.password, password);
  if (!isPasswordValid) {
    const error = new Error("Mot de passe incorrect.");
    error.statusCode = 401;
    error.details = ["Les informations saisies sont incorrectes."];
    return next(error);
  }

  const accessToken = generateAccessToken({ id: user.id });
  const refreshToken = generateRefreshToken({ id: user.id });

  res.status(200).json({ accessToken, refreshToken, user: { id: user.id, email: user.email, created_at: user.created_at, updated_at: user.updated_at } });
}

/**
 * Refreshes an expired access token.
 * 
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh an expired access token.
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: New access token generated.
 *       403:
 *         description: Invalid or expired refresh token.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing the refresh token.
 * @param {string} req.body.refreshToken - The refresh token.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Returns a new access token or an error.
 */
export async function refreshToken(req, res, next) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    const error = new Error("Accès non autorisé.");
    error.statusCode = 403;
    return next(error);
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken({ id: decoded.id });
    res.status(200).json({ accessToken });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      void error;
      error.message = "Session expirée";
      error.statusCode = 403;
      error.details = ["Veuillez vous reconnecter."];
    } else {
      error.message = "Accès non autorisé.";
      error.statusCode = 403;
    }
    return next(error);
  }
}