const db = require('../Models');
require('dns').setDefaultResultOrder('ipv4first');

async function init() {
    try {
        await db.sequelize.sync({ alter: true });
        console.log("Tables created successfully ✅");
        process.exit(0);
    } catch (err) {
        console.error("Init DB error ❌:", err);
        process.exit(1);
    }
}

init();