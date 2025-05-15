import { Category } from "../models/index.js";

export async function getAllCategories(req,res,next) {

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

export async function createOneCategory(req, res) {

  const { name } = req.body;
    
  const createdCategory = await Category.create({ name });

  res.status(201).json(createdCategory);
};

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