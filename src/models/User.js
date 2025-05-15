import { sequelize } from "../database/databaseClient.js";
import { Model, DataTypes } from "sequelize";

export class User extends Model {}

User.init({
  email: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: true,
  }
}, {
  sequelize,
  tableName: "user",
});