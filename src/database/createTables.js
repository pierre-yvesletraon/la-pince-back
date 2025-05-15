import { sequelize } from "../models/index.js";
import { seedTables } from "./seedTables.js";

async function createTables() {

  try {
    await sequelize.authenticate();
    console.log("✅ Connexion OK");

    await sequelize.sync({ force: true });
    console.log("✅ Base de données synchronisée");

    await seedTables();

  } catch (error) {
    console.error(error);

  } finally {
    await sequelize.close();
  }

}

createTables();