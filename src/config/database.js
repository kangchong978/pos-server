const mysql = require('mysql2/promise');
const dotenv = require('dotenv');


dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});



async function initializeDatabase() {
    const connection = await pool.getConnection();
    const DB_NAME = process.env.DB_NAME;
    try {
        // Check if the database exists
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        console.log(`Database ${DB_NAME} is ready.`);

        // Use the database
        await connection.query(`USE \`${DB_NAME}\`;`);

        // Create tables if they do not exist
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                accessToken VARCHAR(255),
                phoneNumber VARCHAR(255),
                role VARCHAR(255),
                enable BOOLEAN DEFAULT TRUE,
                tempPassword VARCHAR(255)
            );
        `);
        console.log('Users table is ready.');

        // Ensure the routes_auth table exists
        await connection.query(`
            CREATE TABLE IF NOT EXISTS routes_auth (
                id INT AUTO_INCREMENT PRIMARY KEY,
                route VARCHAR(255) NOT NULL,
                role VARCHAR(255),
                enable BOOLEAN DEFAULT TRUE
            );
        `);
        // Define routes and roles to be inserted
        const routes = [
            { route: '/pos', role: 'admin' },
            { route: '/dashboard', role: 'admin' },
            { route: '/products', role: 'admin' },
            { route: '/sales', role: 'admin' },
            { route: '/orders', role: 'admin' },
            { route: '/analytics', role: 'admin' },
            { route: '/employees', role: 'admin' },
            { route: '/settings', role: 'admin' }
        ];

        // Loop through each route and role to check if it exists and insert if not
        for (const { route, role } of routes) {
            const [rows] = await connection.query(
                'SELECT * FROM routes_auth WHERE route = ? AND role = ?',
                [route, role]
            );

            // If the route and role do not exist, insert them
            if (rows.length === 0) {
                const [result] = await connection.query(
                    'INSERT INTO routes_auth (route, role) VALUES (?, ?)',
                    [route, role]
                );
                console.log(`Inserted record with route: ${route}, ID: ${result.insertId}`);
            } else {
                console.log(`Record already exists for route: ${route}`);
            }
        }
        // Ensure the products table exists
        await connection.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255),
                category VARCHAR(100),
                description TEXT,
                price DECIMAL(10, 2) NOT NULL
            );
        `);


        // Add more table creation queries as needed
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        connection.release();
    }
}

module.exports = { pool, initializeDatabase };
