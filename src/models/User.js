import { sequelize } from "../database/databaseClient.js";
import { Model, DataTypes } from "sequelize";

/**
 * Represents a user in the application.
 * 
 * @class User
 * @extends {Model}
 * 
 * @property {string} email - The email address of the user.
 * @property {string} password - The hashed password of the user.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: user@example.com
 *         password:
 *           type: string
 *           example: Password123!
 */
export class User extends Model {}

/**
 * Initializes the User model.
 * 
 * @param {Object} sequelize - The Sequelize instance.
 * @param {Object} DataTypes - The Sequelize data types.
 */
User.init({
  /**
   * The email address of the user.
   * @type {string}
   */
  email: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: true,
  },
  /**
   * The hashed password of the user.
   * @type {string}
   */
  password: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: true,
  }
}, {
  sequelize,
  tableName: "user",
});