const db = require('../Models');
require('dns').setDefaultResultOrder('ipv4first');

async function resetDB() {
    try {
        console.log("⚠️ Resetting database...");
        await db.sequelize.sync({ force: true });
        console.log("✅ Database reset completed (tables recreated)");
        process.exit(0);

    } catch (err) {
        console.error("❌ DB reset failed:", err);
        process.exit(1);
    }
}

resetDB();