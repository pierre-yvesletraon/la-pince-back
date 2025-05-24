import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/databaseClient.js";

/**
 * Represents an expense in the application.
 * 
 * @class Expense
 * @extends {Model}
 * 
 * @property {number} amount - The amount of the expense.
 * @property {string} description - A description of the expense.
 * @property {string} date - The date of the expense (YYYY-MM-DD).
 * @property {number} category_id - The ID of the associated category.
 * @property {number} user_id - The ID of the user who owns the expense.
 */
export class Expense extends Model {}

/**
 * @swagger
 * components:
 *   schemas:
 *     Expense:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         amount:
 *           type: number
 *           example: 50.75
 *         description:
 *           type: string
 *           example: "Dinner at a restaurant"
 *         date:
 *           type: string
 *           format: date
 *           example: "2023-10-01"
 *         category_id:
 *           type: integer
 *           example: 2
 *         user_id:
 *           type: integer
 *           example: 1
 */

/**
 * Initializes the Expense model.
 * 
 * @param {Object} sequelize - The Sequelize instance.
 * @param {Object} DataTypes - The Sequelize data types.
 */
Expense.init({
  /**
   * The amount of the expense.
   * @type {number}
   */
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  /**
   * A description of the expense.
   * @type {string}
   */
  description: {
    type: DataTypes.STRING(255),
  },
  /**
   * The date of the expense (YYYY-MM-DD).
   * @type {string}
   */
  date: {
    type: DataTypes.DATEONLY,
  },
  /**
   * The ID of the associated category.
   * @type {number}
   */
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  /**
   * The ID of the user who owns the expense.
   * @type {number}
   */
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: "expense",
});