import { Budget } from "../models/index.js";

/**
 * Retrieves all budgets for the authenticated user.
 * 
 * @swagger
 * /budgets:
 *   get:
 *     summary: Retrieve all budgets for the authenticated user.
 *     tags: [Budgets]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of budgets retrieved successfully.
 *       401:
 *         description: Unauthorized.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Returns a list of budgets.
 */
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

/**
 * Creates a new budget.
 * 
 * @swagger
 * /budgets:
 *   post:
 *     summary: Create a new budget.
 *     tags: [Budgets]
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
 *                 example: 500
 *               category_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Budget created successfully.
 *       400:
 *         description: Budget already exists for this category.
 *       401:
 *         description: Unauthorized.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing budget data.
 * @param {number} req.body.amount - Amount of the budget.
 * @param {number} req.body.category_id - ID of the associated category.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Returns the created budget or an error.
 */
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

/**
 * Updates an existing budget.
 * 
 * @swagger
 * /budgets/{id}:
 *   patch:
 *     summary: Update an existing budget.
 *     tags: [Budgets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the budget to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 600
 *               category_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Budget updated successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Budget not found.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - ID of the budget to update.
 * @param {Object} req.body - Request body containing updated data.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Returns the updated budget or an error.
 */
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

/**
 * Deletes a budget by its ID.
 * 
 * @swagger
 * /budgets/{id}:
 *   delete:
 *     summary: Delete a budget by its ID.
 *     tags: [Budgets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the budget to delete.
 *     responses:
 *       200:
 *         description: Budget deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Budget not found.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - ID of the budget to delete.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Returns a success message or an error.
 */
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
