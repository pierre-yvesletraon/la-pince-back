import { Budget, User, Category, Expense } from "../models/index.js";
import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function backupData() {
  const data = {
    users: await User.findAll({ raw: true }),
    budgets: await Budget.findAll({ raw: true }),
    categories: await Category.findAll({ raw: true }),
    expenses: await Expense.findAll({ raw: true }),
  };

  const timestamp = new Date().toLocaleDateString("fr-FR").replaceAll("/", "-");
  const filePath = path.join(__dirname, `backup-${timestamp}.json`);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log("✅ Sauvegarde effectuée");
}
