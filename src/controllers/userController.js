import { validateEmail, validatePassword } from "../utils/validators.js";
import { User } from "../models/User.js";
import { hash, verify } from "argon2";

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

// UPDATE USER
export async function updateUser(req, res, next) {
  const userId = req.user.id;
  const { email, oldPassword, password } = req.body;

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
    if (!oldPassword) {
      const error = new Error("L'ancien mot de passe est requis pour changer le mot de passe.");
      error.statusCode = 400;
      return next(error);
    }

    const isOldPasswordValid = await verify(user.password, oldPassword);
    if (!isOldPasswordValid) {
      const error = new Error("L'ancien mot de passe est incorrect.");
      error.statusCode = 400;
      return next(error);
    }

    const isSame = await verify(user.password, password);
    if (isSame) {
      const error = new Error("Le nouveau mot de passe doit être différent de l'actuel.");
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

// DELETE USER
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