import { User } from "../models/User.js";
import { hash, verify } from "argon2";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { validateEmail, validatePassword } from "../utils/validators.js";

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