const { pool } = require("../config/database");


class RouteAuth {
    static proceedData(raw) {
        if (!raw) return;
        delete raw['enable']
        return {
            ...raw,
            // role: raw.role ? raw.role.split(',') : []
        };
    }
    static async getAllowedRoutes(role) {
        var connection = await pool.getConnection();
        try {
            // Fetch all records where enable = 1
            const [result] = await connection.query(
                'SELECT * FROM routes_auth WHERE enable = ?',
                [1]
            );

            // Split the passed role string by commas into an array
            const roleArray = role.split(',').map(r => r.trim().toLowerCase());

            // Filter the result where item['role'] contains any value in roleArray
            const filteredRoutes = result.filter(item => {
                // Split the role string from the database record into an array
                const itemRoleArray = item.role.split(',').map(r => r.trim().toLowerCase());

                // Check if any role in roleArray exists in itemRoleArray
                return roleArray.some(r => itemRoleArray.includes(r));
            });

            return filteredRoutes.map((v) => this.proceedData(v)); // Return the filtered records
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getRoutesAuth() {
        var connection = await pool.getConnection();
        try {
            // Fetch all records where enable = 1
            const [result] = await connection.query(
                'SELECT * FROM routes_auth WHERE enable = ?',
                [1]
            );
            return result.map((v) => this.proceedData(v)); // Return the filtered records
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async updateRoutesAuth(routesAuth) {
        var connection = await pool.getConnection();
        try {
            for (const route of routesAuth) {
                // Update each route based on its ID
                await connection.query(
                    'UPDATE routes_auth SET role = ? WHERE id = ?',
                    [route, route.id]
                );
            }
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

}

module.exports = RouteAuth;
