import { Budget, User, Category, Expense, sequelize } from "../models/index.js";
import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function restoreData() {
  const timestamp = new Date().toLocaleDateString("fr-FR").replaceAll("/", "-");
  const filePath = path.join(__dirname, `backup-${timestamp}.json`);
  const data = JSON.parse(fs.readFileSync(filePath));

  await User.bulkCreate(data.users);
  await Category.bulkCreate(data.categories);
  await Budget.bulkCreate(data.budgets);
  await Expense.bulkCreate(data.expenses);

  await sequelize.query(`
    SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));
    SELECT setval('category_id_seq', (SELECT MAX(id) from "category"));
    SELECT setval('expense_id_seq', (SELECT MAX(id) from "expense"));
    SELECT setval('budget_id_seq', (SELECT MAX(id) from "budget"));
  `);

  console.log("✅ Restauration effectuée");
}