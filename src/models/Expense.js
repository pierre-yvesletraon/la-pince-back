import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/databaseClient.js";

export class Expense extends Model {}

Expense.init({
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(255)
  },
  date: {
    type: DataTypes.DATEONLY
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
},

{
  sequelize,
  tableName: "expense",
});