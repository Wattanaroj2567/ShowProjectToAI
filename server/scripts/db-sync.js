// scripts/db-sync.js
require('dotenv').config();
const { sequelize } = require('../src/db/sequelize');
require('../src/model-registry');

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized (alter: true)');
    process.exit(0);
  } catch (err) {
    console.error('DB sync failed', err);
    process.exit(1);
  }
})();
