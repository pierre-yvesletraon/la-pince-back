import { validateEmail, validatePassword } from "../utils/validators.js";
import { User } from "../models/User.js";
import { hash, verify } from "argon2";

/**
 * Retrieves the profile of the authenticated user.
 * 
 * @swagger
 * /me:
 *   get:
 *     summary: Retrieve the profile of the authenticated user.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Returns the user's profile or an error.
 */
export async function getProfile(req, res, next) {
  const userId = req.user.id;

  const user = await User.findByPk(userId, {
    attributes: ["id", "email", "created_at"],
  });

  if (!user) {
    const error = new Error("Utilisateur introuvable.");
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json(user);
}

/**
 * Finds a user by their ID.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Returns the user or an error.
 */
export async function findUserById(req, res, next) {
  const userId = req.user.id;

  const user = await User.findByPk(userId, {
    attributes: ["id", "email", "created_at"],
  });

  if (!user) {
    const error = new Error("Utilisateur introuvable.");
    error.statusCode = 404;
    error.details = [`Aucun utilisateur trouvé avec l'identifiant ${userId}.`];
    return next(error);
  }

  res.status(200).json(user);
}

/**
 * Updates the authenticated user's information.
 * 
 * @swagger
 * /me:
 *   patch:
 *     summary: Update the authenticated user's information.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: newuser@example.com
 *               password:
 *                 type: string
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       409:
 *         description: Email already in use.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing updated data.
 * @param {string} [req.body.email] - New email address.
 * @param {string} [req.body.password] - New password.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Returns the updated user or an error.
 */
export async function updateUser(req, res, next) {
  const userId = req.user.id;
  const { email, password } = req.body;

  const user = await User.findByPk(userId);

  if (!user) {
    const error = new Error("Utilisateur introuvable.");
    error.statusCode = 404;
    error.details = [`Aucun utilisateur trouvé avec l'identifiant ${userId}.`];
    return next(error);
  }

  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ where: { email } });

    if (existingEmail) {
      const error = new Error("Adresse e-mail non disponible.");
      error.statusCode = 409;
      error.details = ["L'adresse e-mail est déjà associée à un autre compte."];
      return next(error);
    }

    await validateEmail(email);
    user.email = email;
  }

  if (password) {
    const isSame = await verify(user.password, password);
    if (isSame) {
      const error = new Error("Le nouveau mot de passe doit être différent de l'actuel");
      error.statusCode = 400;
      return next(error);
    }
    validatePassword(password);
    user.password = await hash(password, { type: 2 });
  }

  await user.save();

  res.status(200).json({
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at,
  });
}

/**
 * Deletes the authenticated user's account.
 * 
 * @swagger
 * /me:
 *   delete:
 *     summary: Delete the authenticated user's account.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Returns a success message or an error.
 */
export async function deleteUser(req, res, next) {

  const userId = req.user.id;
  const user = await User.destroy({ where: { id: userId } });

  if (!user) {
    const error = new Error("Utilisateur introuvable.");
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({ message: "Utilisateur supprimé avec succès" });
}