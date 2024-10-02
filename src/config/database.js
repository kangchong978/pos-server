const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false // Set to console.log to see SQL queries
});

async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Run migrations
        const { exec } = require('child_process');
        // exec('npx sequelize-cli db:migrate', (error, stdout, stderr) => {
        //     if (error) {
        //         console.error(`Error running migrations: ${error}`);
        //         return;
        //     }
        //     console.log(`Migrations completed: ${stdout}`);

        //     // Run seeds after migrations
        //     exec('npx sequelize-cli db:seed:all', (error, stdout, stderr) => {
        //         if (error) {
        //             console.error(`Error running seeds: ${error}`);
        //             return;
        //         }
        //         console.log(`Seeds completed: ${stdout}`);
        //     });
        // });

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = { sequelize, initializeDatabase };