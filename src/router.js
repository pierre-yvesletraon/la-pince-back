import { Router } from "express";
import CW from "./middlewares/controllerWrapper.js";
import { validateIdParam } from "./middlewares/validateIdParam.js";
import { getAllBudgets, createOneBudget, updateOneBudget, deleteOneBudget } from "./controllers/budgetController.js";
import { getAllExpenses, createOneExpense, updateOneExpense, deleteOneExpense } from "./controllers/expenseController.js";
import { getAllCategories, getOneCategory, createOneCategory, updateOneCategory, deleteOneCategory } from "./controllers/categoryController.js";
import { validateSchema } from "./middlewares/validateSchema.js";
import { createBudgetSchema, updateBudgetSchema } from "./schemas/budgetSchemas.js";
import { createExpenseSchema, updateExpenseSchema } from "./schemas/expenseSchemas.js";
import { registerUser, loginUser, refreshToken } from "./controllers/authController.js";
import { validateAuth } from "./middlewares/validateAuth.js";
import { getProfile, updateUser, deleteUser } from "./controllers/userController.js";


export const router = Router();

// CATEGORIES
router.get("/categories", CW(getAllCategories));
router.get("/categories/:id", validateIdParam, CW(getOneCategory));
router.post("/categories", validateSchema, CW(createOneCategory));
router.patch("/categories/:id", validateIdParam, validateSchema, CW(updateOneCategory));
router.delete("/categories/:id", validateIdParam, CW(deleteOneCategory));

// BUDGETS
router.get("/budgets", validateAuth, CW(getAllBudgets));
router.post("/budgets", validateAuth, validateSchema(createBudgetSchema), CW(createOneBudget));
router.patch("/budgets/:id", validateAuth, validateIdParam, validateSchema(updateBudgetSchema), CW(updateOneBudget));
router.delete("/budgets/:id", validateAuth, validateIdParam, CW(deleteOneBudget));

// EXPENSES
router.get("/expenses", validateAuth, CW(getAllExpenses));
router.post("/expenses", validateAuth, validateSchema(createExpenseSchema), CW(createOneExpense));
router.patch("/expenses/:id", validateAuth, validateIdParam, validateSchema(updateExpenseSchema), CW(updateOneExpense));
router.delete("/expenses/:id", validateAuth, validateIdParam, CW(deleteOneExpense));

// AUTH-USERS
router.post("/auth/register", CW(registerUser));
router.post("/auth/login", CW(loginUser));
router.post("/auth/refresh", CW(refreshToken));
router.get("/me", validateAuth, CW(getProfile));
router.patch("/me", validateAuth, CW(updateUser));
router.delete("/me", validateAuth, CW(deleteUser));

