const { pool } = require("../config/database");
const multer = require('multer');
const path = require('path');
const util = require('util');

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/product/'); // Define where to store the uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Rename the file to avoid conflicts
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB size limit
});

class Product {

    static proceedData(raw) {
        if (!raw) return;
        delete raw['enable']
        return {
            ...raw,
        };
    }

    static async getProducts(searchTerm, page, categoryFilter) {
        const connection = await pool.getConnection();
        try {
            // Set the number of items per page for pagination
            const itemsPerPage = 20;
            const offset = (page - 1) * itemsPerPage;

            // Construct the base query
            let query = `
            SELECT * FROM products
            WHERE enable = ?
              AND name LIKE ?
          `;

            // Add category filter if provided
            if (categoryFilter) {
                query += ` AND (
              category = ? OR
              category LIKE ? OR
              category LIKE ? OR
              category LIKE ?
            )`;
            }

            // Add pagination
            query += ` LIMIT ? OFFSET ?`;

            // Prepare query parameters
            const queryParams = [1, `%${searchTerm}%`];
            if (categoryFilter) {
                queryParams.push(
                    categoryFilter,
                    `${categoryFilter},%`,
                    `%, ${categoryFilter},%`,
                    `%, ${categoryFilter}`
                );
            }
            queryParams.push(itemsPerPage, offset);

            // Execute the query
            const [result] = await connection.query(query, queryParams);

            // Return the filtered and paginated records
            return result.map((v) => this.proceedData(v));
        } catch (error) {
            // Handle error
            throw error;
        } finally {
            connection.release();
        }
    }

    // static async getProducts(searchTerm, page) {
    //     const connection = await pool.getConnection();

    //     try {
    //         // Set the number of items per page for pagination
    //         const itemsPerPage = 20;
    //         const offset = (page - 1) * itemsPerPage;

    //         // Fetch records where enable = 1 and filter by product name (if searchTerm is provided)
    //         const [result] = await connection.query(
    //             `SELECT * FROM products 
    //              WHERE enable = ? AND name LIKE ?
    //              LIMIT ? OFFSET ?`,
    //             [1, `%${searchTerm}%`, itemsPerPage, offset]
    //         );

    //         return result.map((v) => this.proceedData(v)); // Return the filtered and paginated records
    //     } catch (error) {
    //         // Handle error
    //         throw error;
    //     } finally {
    //         connection.release();
    //     }
    // }

    static async createProduct(name, image, category, description, price) {
        var connection = await pool.getConnection();
        try {
            const [result] = await connection.query(
                'INSERT INTO products (name, image, category, description, price) VALUES (?, ?, ?, ?, ?)',
                [name, image, category, description, price]
            );
            return result.insertId;
        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    }

    static async updateProduct(id, name, image, category, description, price) {
        var connection = await pool.getConnection();
        try {
            await connection.query(
                'UPDATE products SET name = ?, image = ?, category = ?, description = ?, price = ? WHERE id = ? AND enable = ?',
                [name, image, category, description, price, id, 1]
            );
        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    }

    static async removeProduct(id) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                'UPDATE products SET enable = ? WHERE id = ?',
                [0, id] // Set status to 0
            );
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async uploadProductImg(req, res) {
        // Wrap multer upload handler in a promise
        const uploadFile = util.promisify(upload.single('upload-image'));

        try {
            // Await the upload process
            await uploadFile(req, res);

            if (!req.file) {
                throw 'No file uploaded';
            }
            const filePath = req.file.path;
            const fileName = filePath.split('/').pop();
            // Respond with the file path or other relevant information
            return fileName;
        } catch (error) {
            throw error;
            // return res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = Product;
