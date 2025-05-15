import "dotenv/config";
import { Sequelize } from "sequelize";

const databaseUrl = process.env.DATABASE_URL || process.env.PG_URL;

export const sequelize = new Sequelize(databaseUrl, {
  logging: false,
  define: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});