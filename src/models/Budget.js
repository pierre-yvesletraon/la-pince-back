import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/databaseClient.js";

export class Budget extends Model{}

Budget.init({
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  alert: {
    type: DataTypes.INTEGER,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }  
}, {
  sequelize,
  tableName: "budget",
  indexes: [
    {
      unique: true,
      fields: ["user_id", "category_id"], // Contrainte d'unicité sur user_id et category_id
      name: "unique_user_category_budget", // Nom explicite pour l'index
    }
  ],
});