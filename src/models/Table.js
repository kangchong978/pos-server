const { DataTypes, Model } = require('sequelize');
const { sequelize } = require("../config/database");

class TableModel extends Model { }

TableModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    x: {
        type: DataTypes.DECIMAL(10),
        defaultValue: 0
    },
    y: {
        type: DataTypes.DECIMAL(10),
        defaultValue: 0
    },
    orderId: {
        type: DataTypes.INTEGER
    },
    enable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'Table',
    tableName: 'tables',
    timestamps: true
});

class Table {
    static async getTables() {
        try {
            const tables = await TableModel.findAll({
                where: { enable: true },
                raw: true
            });

            // Fetch associated orders
            const orderIds = tables.filter(t => t.orderId).map(t => t.orderId);
            let orders = [];
            if (orderIds.length > 0) {
                orders = await sequelize.query(
                    'SELECT id, status FROM orders WHERE id IN (:orderIds)',
                    {
                        replacements: { orderIds },
                        type: sequelize.QueryTypes.SELECT
                    }
                );
            }

            // Map orders to tables
            const orderMap = orders.reduce((map, order) => {
                map[order.id] = order;
                return map;
            }, {});

            return tables.map(table => ({
                ...table,
                status: table.orderId ? orderMap[table.orderId]?.status : null
            }));
        } catch (error) {
            console.error('Error in getTables:', error);
            throw error;
        }
    }

    static async updateTablePosition(id, x, y) {
        try {
            await TableModel.update(
                { x, y },
                { where: { id } }
            );
        } catch (error) {
            throw error;
        }
    }

    static async updateTableOrderId(id, orderId) {
        try {
            await TableModel.update(
                { orderId: orderId === undefined ? null : orderId },
                { where: { id } }
            );
        } catch (error) {
            throw error;
        }
    }


    static async createTable(name) {
        try {
            const table = await TableModel.create({ name });
            return table.id;
        } catch (error) {
            throw error;
        }
    }

    static async removeTable(id) {
        try {
            await TableModel.update(
                { enable: false },
                { where: { id } }
            );
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Table;