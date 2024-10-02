// File: config/config.js

require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',  // Explicitly specify the dialect
        dialectOptions: {
            decimalNumbers: true
        }
    },
    test: {
        // Test environment configuration
        // ... (similar to development, but for test database)
        dialect: 'mysql'
    },
    production: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
};