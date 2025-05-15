import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/databaseClient.js";

export class Category extends Model {}

Category.init(
  {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    tableName: 'category'
  }
);