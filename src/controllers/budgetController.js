import { Budget } from "../models/index.js";

export async function getAllBudgets(req, res) {
  const user_id = req.user.id;
  const budgets = await Budget.findAll({
    where: { user_id },
    attributes: { exclude: ["created_at", "updated_at"] },
    include: { association: "category", attributes: ["name"] },
    order: [["created_at", "DESC"]]
  });

  res.status(200).json(budgets);
}

export async function createOneBudget(req, res, next) {
  const user_id = req.user.id;
  const { amount, category_id } = req.body;

  const existingBudget = await Budget.findOne({
    where: { user_id, category_id }
  });

  if (existingBudget) {
    const error = new Error("Vous avez déjà un budget pour cette catégorie.");
    error.statusCode = 400;
    return next(error);
  }

  const alert = Math.round(amount * 0.8);

  const createdBudget = await Budget.create({
    amount,
    alert,
    category_id,
    user_id
  });

  res.status(201).json(createdBudget);

}

export async function updateOneBudget(req, res, next) {
  const userId = req.user.id;
  const budgetId = req.params.id;
  const budgetToUpdate = await Budget.findByPk(budgetId);
  const { category_id } = req.body;

  if (!budgetToUpdate) {
    const error = new Error("Le budget que vous souhaitez modifier est introuvable.");
    error.statusCode = 404;
    return next(error);
  }

  // Vérification de l'unicité uniquement si la catégorie est modifiée
  // pour éviter des requêtes inutiles ou des erreurs de duplication
  if (category_id && category_id !== budgetToUpdate.category_id) {
    const isDuplicate = await Budget.findOne({
      where: { user_id: userId, category_id }
    });

    if (isDuplicate) {
      const error = new Error("Un budget existe déjà pour cet utilisateur et cette catégorie.");
      error.statusCode = 400;
      return next(error);
    }
  }

  Object.entries(req.body).forEach(([key, value]) => {
    if (value !== undefined && key in budgetToUpdate) {
      budgetToUpdate[key] = value;
      budgetToUpdate.alert = Math.round(budgetToUpdate.amount * 0.8);
    }
  });

  const updatedBudget = await budgetToUpdate.save();
  
  res.status(200).json(updatedBudget);
}

export async function deleteOneBudget(req, res, next) {
  const budgetId = req.params.id;
  const deletedBudget = await Budget.destroy({ where: { id: budgetId } });

  if (!deletedBudget) {
    const error = new Error("Le budget que vous souhaitez supprimer est introuvable.");
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({ message: "Budget supprimé avec succès" });
}
