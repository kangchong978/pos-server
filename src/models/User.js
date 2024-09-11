const { pool } = require("../config/database");

class User {
    static proceedData(raw) {
        if (!raw) return;
        delete raw['password']
        delete raw['tempPassword']
        delete raw['enable']
        return {
            ...raw,
            // role: raw.role ? raw.role.split(',') : []
        };
    }

    static checkAuthorized(user, role) {
        var result = user.role.includes(role);
        return result;
    }

    static async getUsers() {
        var connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM users WHERE enable = ?', [1]);
            return rows.map((v) => this.proceedData(v));

        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }

    }

    static async findByUsername(username) {
        var connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM users WHERE username = ? AND enable = ?', [username, 1]);
            return rows[0];

        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }

    }

    static async findByAccessToken(accessToken) {
        var connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM users WHERE accessToken = ? AND enable = ?', [accessToken, 1]);
            return this.proceedData(rows[0]);

        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async create(username, email, password, phoneNumber, role, tempPassword) {
        var connection = await pool.getConnection();
        try {
            const [result] = await connection.query(
                'INSERT INTO users (username, email, password, phoneNumber, role, tempPassword) VALUES (?, ?, ?, ?, ?, ?)',
                [username, email, password, phoneNumber, role, tempPassword]
            );

            return result.insertId;
        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    }

    static async remove(userId) {
        var connection = await pool.getConnection();
        try {
            await connection.query(
                'UPDATE users SET accessToken = ?, enable = ? WHERE id = ? AND enable = ?',
                ['', 0, userId, 1]
            );
        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    }

    static async update(email, phoneNumber, role, id) {
        var connection = await pool.getConnection();
        try {
            await connection.query(
                'UPDATE users SET email = ?, phoneNumber = ?, role = ? WHERE id = ? AND enable = ?',
                [email, phoneNumber, role, id, 1]
            );
        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    }

    static async updatePassword(password, id) {
        var connection = await pool.getConnection();
        try {
            await connection.query(
                'UPDATE users SET password = ?, tempPassword = ? WHERE id = ? AND enable = ?',
                [password, null, id, 1]
            );
        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    }


    static async storeAccessToken(userId, hashedToken) {
        var connection = await pool.getConnection();
        try {
            await connection.query(
                'UPDATE users SET accessToken = ? WHERE id = ? AND enable = ?',
                [hashedToken, userId, 1]
            );
        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    }
}

module.exports = User;