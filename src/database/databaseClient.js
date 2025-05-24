import "dotenv/config";
import { Sequelize } from "sequelize";

/**
 * Configures and exports the Sequelize database client.
 */
export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  define: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});