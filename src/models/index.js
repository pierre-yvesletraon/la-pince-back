import { sequelize } from "../database/databaseClient.js";
import { User } from "./User.js";
import { Budget } from "./Budget.js";
import { Category } from "./Category.js";
import { Expense } from "./Expense.js";

export { User, Budget, Category, Expense, sequelize };

/**
 * Defines the relationships between models.
 * 
 * - A User has many Budgets.
 * - A Budget belongs to a User.
 * - A User has many Expenses.
 * - An Expense belongs to a User.
 * - A Category has many Budgets.
 * - A Budget belongs to a Category.
 * - A Category has many Expenses.
 * - An Expense belongs to a Category.
 */
User.hasMany(Budget, {
  foreignKey: "user_id",
  as: "budgets",
});
Budget.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(Expense, {
  foreignKey: "user_id",
  as: "expenses",
});
Expense.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Category.hasMany(Budget, {
  foreignKey: "category_id",
  as: "budgets",
});
Budget.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});

Category.hasMany(Expense, {
  foreignKey: "category_id",
  as: "expenses",
});
Expense.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});