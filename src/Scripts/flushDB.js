const { sequelize } = require('../Models');
const seeder = require('../Seeders/20260414113627-home-seeder');

async function flushDB() {
  try {
    await sequelize.sync({ force: true });

    console.log('Database flushed ✅');
    await seeder.up(sequelize.getQueryInterface(), sequelize.Sequelize);

    console.log('Seeder executed 🌱');

    process.exit(0);
  } catch (error) {
    console.error('Error ❌:', error);
    process.exit(1);
  }
}

flushDB();