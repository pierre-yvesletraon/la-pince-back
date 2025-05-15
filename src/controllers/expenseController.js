import { Expense } from "../models/index.js";

export async function getAllExpenses(req, res) {
  const user_id = req.user.id;
  const expenses = await Expense.findAll({ where: { user_id },
    attributes: { exclude: ["created_at", "updated_at"] },
    include: {association: "category", attributes: ["name"]},
    order: [["date", "DESC"]]
  });

  res.status(200).json(expenses);
}

export async function createOneExpense(req, res) {
  const user_id = req.user.id;
  const { amount, description, date, category_id } = req.body;
  const createdExpense = await Expense.create({ amount, description, date, category_id, user_id });
  res.status(201).json(createdExpense);
}

export async function updateOneExpense(req, res, next) {
  const expenseId = req.params.id;
  const expenseToUpdate = await Expense.findByPk(expenseId);

  if (!expenseToUpdate) {
    const error = new Error("La dépense que vous souhaitez modifier est introuvable.");
    error.statusCode = 404;
    return next(error);
  }

  Object.entries(req.body).forEach(([key, value]) => {
    if (value !== undefined && key in expenseToUpdate) {
      expenseToUpdate[key] = value;
    }
  });

  const updatedExpense = await expenseToUpdate.save();
  res.status(200).json(updatedExpense);
}

export async function deleteOneExpense(req, res, next) {
  const expenseId = req.params.id;
  const deletedExpense = await Expense.destroy({ where: { id: expenseId } });

  if (!deletedExpense) {
    const error = new Error("La dépense que vous souhaitez supprimer est introuvable.");
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({ message: "Dépense supprimée avec succès" });
}
