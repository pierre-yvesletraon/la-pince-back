import { sequelize } from "../database/databaseClient.js";
import { User } from "./User.js";
import { Budget } from "./Budget.js";
import { Category } from "./Category.js";
import { Expense } from "./Expense.js";

export { User, Budget, Category, Expense, sequelize };

User.hasMany(Budget, {
  foreignKey: "user_id",
  as: "budgets"
});
Budget.belongsTo(User, {
  foreignKey: "user_id",
  as: "user"
});

User.hasMany(Expense, {
  foreignKey: "user_id",
  as: "expenses"
});
Expense.belongsTo(User, {
  foreignKey: "user_id",
  as: "user"
});

Category.hasMany(Budget, {
  foreignKey: "category_id",
  as: "budgets"
});
Budget.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category"
});

Category.hasMany(Expense, {
  foreignKey: "category_id",
  as: "expenses"
});
Expense.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category"
});