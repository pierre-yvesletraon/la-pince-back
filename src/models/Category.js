import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/databaseClient.js";

/**
 * Represents a category in the application.
 * 
 * @class Category
 * @extends {Model}
 * 
 * @property {string} name - The name of the category.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Groceries"
 */
export class Category extends Model {}

/**
 * Initializes the Category model.
 * 
 * @param {Object} sequelize - The Sequelize instance.
 * @param {Object} DataTypes - The Sequelize data types.
 */
Category.init(
  {
    /**
     * The name of the category.
     * @type {string}
     */
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'category',
  }
);