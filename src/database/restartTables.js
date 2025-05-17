import { sequelize, User, Budget, Expense, Category } from "../models/index.js";
import { categoryData } from "./seedData.js";

async function restartTables() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion à la base de données réussie\n");

    // Étape 1 : Sauvegarder les données utilisateur et leurs relations
    console.log("🔄 Sauvegarde des données utilisateur et leurs relations...");
    const users = await User.findAll({ raw: true });
    const budgets = await Budget.findAll({ raw: true });
    const expenses = await Expense.findAll({ raw: true });
    console.log("✅ Données sauvegardées avec succès\n");

    // Étape 2 : Réinitialiser les tables
    console.log("🔄 Réinitialisation des tables...");
    await sequelize.sync({ force: true });
    console.log("✅ Tables recréées avec succès\n");

    // Étape 3 : Resynchroniser les catégories avec categoryData
    console.log("🔄 Synchronisation des catégories...");
    const existingCategories = await Category.findAll({ raw: true });

    // Identifier les catégories à ajouter ou à mettre à jour
    const categoriesToUpdate = categoryData.filter(category =>
      existingCategories.some(existing => existing.id === category.id && existing.name !== category.name)
    );

    const categoriesToAdd = categoryData.filter(category =>
      !existingCategories.some(existing => existing.id === category.id)
    );

    // Mettre à jour les catégories existantes
    for (const category of categoriesToUpdate) {
      await Category.update({ name: category.name }, { where: { id: category.id } });
    }

    // Ajouter les nouvelles catégories
    await Category.bulkCreate(categoriesToAdd, { ignoreDuplicates: true });
    console.log("✅ Catégories synchronisées avec succès\n");

    // Étape 4 : Restaurer les données utilisateur et leurs relations
    console.log("🔄 Restauration des données utilisateur et leurs relations...");
    await User.bulkCreate(users, { ignoreDuplicates: true });
    await Budget.bulkCreate(budgets, { ignoreDuplicates: true });
    await Expense.bulkCreate(expenses, { ignoreDuplicates: true });
    console.log("✅ Données restaurées avec succès\n");

    // Étape 5 : Réaligner les séquences des identifiants
    console.log("🔄 Réalignement des séquences des identifiants...");
    await sequelize.query(`
      SELECT setval('user_id_seq', (SELECT MAX(id) FROM "user"));
      SELECT setval('category_id_seq', (SELECT MAX(id) FROM "category"));
      SELECT setval('expense_id_seq', (SELECT MAX(id) FROM "expense"));
      SELECT setval('budget_id_seq', (SELECT MAX(id) FROM "budget"));
    `);
    console.log("✅ Séquences réalignées avec succès\n");

  } catch (error) {
    console.error("\n❌ Erreur lors du redémarrage des tables :", error);
  } finally {
    await sequelize.close();
    console.log("✅ Connexion à la base de données fermée\n");
  }
  console.log("✅ Processus de redémarrage des tables terminé\n");
}

restartTables();