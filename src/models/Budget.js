import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/databaseClient.js";

/**
 * Represents a budget in the application.
 * 
 * @class Budget
 * @extends {Model}
 * 
 * @property {number} amount - The amount allocated for the budget.
 * @property {number} alert - The alert threshold for the budget (e.g., 80% of the amount).
 * @property {number} category_id - The ID of the associated category.
 * @property {number} user_id - The ID of the user who owns the budget.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Budget:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         amount:
 *           type: number
 *           example: 500
 *         alert:
 *           type: number
 *           example: 80
 *         category_id:
 *           type: integer
 *           example: 2
 *         user_id:
 *           type: integer
 *           example: 1
 */
export class Budget extends Model {}

/**
 * Initializes the Budget model.
 * 
 * @param {Object} sequelize - The Sequelize instance.
 * @param {Object} DataTypes - The Sequelize data types.
 */
Budget.init({
  /**
   * The amount allocated for the budget.
   * @type {number}
   */
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  /**
   * The alert threshold for the budget.
   * @type {number}
   */
  alert: {
    type: DataTypes.INTEGER,
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
   * The ID of the user who owns the budget.
   * @type {number}
   */
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: "budget",
  indexes: [
    {
      unique: true,
      fields: ["user_id", "category_id"], // Uniqueness constraint on user_id and category_id
      name: "unique_user_category_budget", // Explicit name for the index
    }
  ],
});