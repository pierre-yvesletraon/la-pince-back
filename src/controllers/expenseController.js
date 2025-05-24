import { Expense } from "../models/index.js";

/**
 * Retrieves all expenses for the authenticated user.
 * 
 * @swagger
 * /expenses:
 *   get:
 *     summary: Retrieve all expenses for the authenticated user.
 *     tags: [Expenses]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of expenses retrieved successfully.
 *       401:
 *         description: Unauthorized.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Returns a list of expenses.
 */
export async function getAllExpenses(req, res) {
  const user_id = req.user.id;
  const expenses = await Expense.findAll({ where: { user_id },
    attributes: { exclude: ["created_at", "updated_at"] },
    include: {association: "category", attributes: ["name"]},
    order: [["date", "DESC"]]
  });

  res.status(200).json(expenses);
}

/**
 * Creates a new expense.
 * 
 * @swagger
 * /expenses:
 *   post:
 *     summary: Create a new expense.
 *     tags: [Expenses]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 50
 *               description:
 *                 type: string
 *                 example: "Dinner at a restaurant"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2023-10-01"
 *               category_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Expense created successfully.
 *       401:
 *         description: Unauthorized.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing expense data.
 * @param {number} req.body.amount - Amount of the expense.
 * @param {string} req.body.description - Description of the expense.
 * @param {string} req.body.date - Date of the expense.
 * @param {number} req.body.category_id - ID of the associated category.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Returns the created expense.
 */
export async function createOneExpense(req, res) {
  const user_id = req.user.id;
  const { amount, description, date, category_id } = req.body;
  const createdExpense = await Expense.create({ amount, description, date, category_id, user_id });
  res.status(201).json(createdExpense);
}

/**
 * Updates an existing expense.
 * 
 * @swagger
 * /expenses/{id}:
 *   patch:
 *     summary: Update an existing expense.
 *     tags: [Expenses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 75
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2023-10-02"
 *               category_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Expense updated successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Expense not found.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - ID of the expense to update.
 * @param {Object} req.body - Request body containing updated data.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Returns the updated expense or an error.
 */
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

/**
 * Deletes an expense by its ID.
 * 
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Delete an expense by its ID.
 *     tags: [Expenses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Expense deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Expense not found.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - ID of the expense to delete.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Returns a success message or an error.
 */
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
