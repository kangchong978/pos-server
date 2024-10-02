const { DataTypes, Op } = require('sequelize');
const { sequelize } = require("../config/database");

const RouteAuthModel = sequelize.define('RouteAuth', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    route: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    enable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'routes_auth',
    timestamps: false
});

class RouteAuth {
    static proceedData(raw) {
        if (!raw) return;
        const { enable, ...processed } = raw.toJSON();
        return processed;
    }

    static async getAllowedRoutes(role) {
        try {
            if (!role) return [];

            const result = await RouteAuthModel.findAll({
                where: { enable: true }
            });

            const roleArray = role.split(',').map(r => r.trim().toLowerCase());

            const filteredRoutes = result.filter(item => {
                const itemRoleArray = item.role.split(',').map(r => r.trim().toLowerCase());
                return roleArray.some(r => itemRoleArray.includes(r));
            });

            return filteredRoutes.map((v) => this.proceedData(v));
        } catch (error) {
            throw error;
        }
    }

    static async getRoutesAuth() {
        try {
            const result = await RouteAuthModel.findAll({
                where: { enable: true }
            });
            return result.map((v) => this.proceedData(v));
        } catch (error) {
            throw error;
        }
    }

    static async updateRoutesAuth(routesAuth) {
        try {
            for (const route of routesAuth) {
                await RouteAuthModel.update(
                    { role: route.role },
                    { where: { id: route.id } }
                );
            }
        } catch (error) {
            throw error;
        }
    }

    static async findMatchingRoute(routePath) {
        try {
            const routeAuth = await RouteAuthModel.findOne({
                where: {
                    [Op.or]: [
                        { route: routePath },
                        { route: routePath.split('/')[1] + '/*' } // Matches '/order/*' for '/order/something'
                    ],
                    enable: true
                }
            });

            return routeAuth ? this.proceedData(routeAuth) : null;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = RouteAuth;