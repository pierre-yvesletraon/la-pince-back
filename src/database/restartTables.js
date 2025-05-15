import { sequelize } from "../models/index.js";
import { backupData } from "./backupData.js";
import { restoreData } from "./restoreData.js";

async function restartTables() {

  try {
    await sequelize.authenticate();
    console.log("✅ Connexion OK");

    await backupData();

    await sequelize.sync({ force: true });
    console.log("✅ Base de données synchronisée");

    await restoreData();

  } catch (error) {
    console.error(error);

  } finally {
    await sequelize.close();
  }

}

restartTables();