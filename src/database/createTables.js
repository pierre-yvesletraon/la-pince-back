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
    console.error("❌ Erreur lors de la création des tables :", error);

  } finally {
    await sequelize.close();
    console.log("✅ Connexion à la base de données fermée");
  }
  console.log("🔄 Processus de création des tables terminé");
}

createTables();