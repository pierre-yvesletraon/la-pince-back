import { Category } from "../models/index.js";

/**
 * Retrieves all categories.
 * 
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve all categories.
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories retrieved successfully.
 *       401:
 *         description: Unauthorized.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Returns a list of categories or an error.
 */
export async function getAllCategories(req, res, next) {

  const categories = await Category.findAll({
    include: ["budgets", "expenses"],
    order: [["id", "ASC"]]
  });

  if(!categories || categories.length === 0) {
    const error = new Error("Les catégories demandées sont introuvables.");
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json(categories);
};

/**
 * Retrieves a single category by its ID.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - ID of the category to retrieve.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Returns the category or an error.
 */
export async function getOneCategory(req, res, next) {

  const categoryId = req.params.id;

  const category = await Category.findByPk(categoryId);

  if (!category) {
    const error = new Error("La catégorie demandée est introuvable.");
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json(category);
};

/**
 * Creates a new category.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing category data.
 * @param {string} req.body.name - Name of the category.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Returns the created category.
 */
export async function createOneCategory(req, res) {

  const { name } = req.body;
    
  const createdCategory = await Category.create({ name });

  res.status(201).json(createdCategory);
};

/**
 * Updates an existing category.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - ID of the category to update.
 * @param {Object} req.body - Request body containing updated data.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Returns the updated category or an error.
 */
export async function updateOneCategory(req, res, next) {

  const categoryId = req.params.id;

  const categoryToUpdate = await Category.findByPk(categoryId);

  if (!categoryToUpdate) {
    const error = new Error("La catégorie demandée est introuvable.");
    error.statusCode = 404;
    return next(error);
  }

  const { name } = req.body;
  if (name) {
    categoryToUpdate.name = name;
  }

  const updatedCategory = await categoryToUpdate.save();
  res.status(200).json(updatedCategory);
};

/**
 * Deletes a category by its ID.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - ID of the category to delete.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Returns a success message or an error.
 */
export async function deleteOneCategory(req, res, next) {

  const categoryId = req.params.id;

  const deletedCategory = await Category.findByPk(categoryId);

  if (!deletedCategory) {
    const error = new Error("La catégorie demandée est introuvable.");
    error.statusCode = 404;
    return next(error);
  }

  await deletedCategory.destroy();
  res.status(200).json({ message: "Catégorie supprimée avec succès" });
};