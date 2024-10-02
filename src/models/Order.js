const { DataTypes, Model, Op } = require('sequelize');
const { sequelize } = require("../config/database");

class OrderModel extends Model { }

OrderModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    products: {
        type: DataTypes.TEXT
    },
    subTotal: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    tax: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active'
    },
    tableId: {
        type: DataTypes.INTEGER
    },
    enable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: false
});

class Order {
    static proceedData(raw) {
        if (!raw) return null;
        const processed = raw.toJSON();
        delete processed.enable;

        if (processed.products) {
            try {
                processed.products = JSON.parse(processed.products).products;
            } catch (error) {
                console.error('Failed to parse products:', error);
                processed.products = null;
            }
        }

        processed.subTotal = Number(processed.subTotal);
        processed.total = Number(processed.total);
        processed.tax = Number(processed.tax);

        processed.createdAt = new Date(processed.createdAt);
        processed.updatedAt = new Date(processed.updatedAt);

        return processed;
    }

    static async getOrderById(id) {
        try {
            const order = await OrderModel.findOne({
                where: { id, enable: true }
            });
            return order ? this.proceedData(order) : null;
        } catch (error) {
            throw error;
        }
    }

    static async getOrders(filters = {}) {
        try {
            const whereClause = { enable: true };

            if (filters.status) {
                whereClause.status = filters.status;
            }

            if (filters.id) {
                whereClause.id = filters.id;
            }

            const orders = await OrderModel.findAll({
                where: whereClause,
                order: [['updatedAt', 'DESC']]
            });

            return orders.map(v => this.proceedData(v));
        } catch (error) {
            throw error;
        }
    }

    static async createOrder(orderType, tableId, tableName) {
        try {
            const order = await OrderModel.create({
                orderType,
                products: '',
                subTotal: 0,
                tax: 0,
                total: 0,
                tableId,
                tableName
            });
            return order.id;
        } catch (error) {
            throw error;
        }
    }

    static async updateOrderStatus(id, status) {
        try {
            await OrderModel.update(
                { status },
                { where: { id, enable: true } }
            );
        } catch (error) {
            throw error;
        }
    }

    static async updateOrder(id, orderType, products, subTotal, tax, total, tableId) {
        try {
            await OrderModel.update(
                {
                    orderType,
                    products: JSON.stringify({ products }),
                    subTotal,
                    tax,
                    total,
                    tableId: tableId ? tableId : null,
                    updatedAt: sequelize.fn('NOW')
                },
                { where: { id, enable: true } }
            );
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Order;