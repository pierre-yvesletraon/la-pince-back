import { isPositiveInteger } from "../utils/validators.js";

export function validateIdParam(req, res, next) {
  
  const { id } = req.params;

  if (!isPositiveInteger(id)) {
    const error = new Error("L'identifiant fourni n'est pas valide.");
    error.details = ["L'identifiant doit être un entier positif, sans espaces ni caractères spéciaux."];
    error.statusCode = 400;
    return next(error);
  }

  req.params.id = Number(id);

  next();
}


// On parse l'id pour en faire un entier en base 10 (système décimal classique)
// Le deuxième argument "10" garantit que l'interprétation se fait bien en base décimale