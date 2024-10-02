const { DataTypes, Model, Op } = require('sequelize');
const { sequelize } = require("../config/database");

class SaleModel extends Model { }

SaleModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    tax_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    payment_method: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transaction_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'Sale',
    tableName: 'sales',
    timestamps: false
});

class Sale {
    static async recordSale(orderId, totalAmount, taxAmount, paymentMethod) {
        try {
            await SaleModel.create({
                order_id: orderId,
                total_amount: totalAmount,
                tax_amount: taxAmount,
                payment_method: paymentMethod
            });
        } catch (error) {
            throw error;
        }
    }

    static async getTotalSales(startDate, endDate) {
        try {
            const result = await SaleModel.sum('total_amount', {
                where: {
                    transaction_date: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            });
            return result || 0;
        } catch (error) {
            throw error;
        }
    }

    static async getAverageTransactionValue(startDate, endDate) {
        try {
            const result = await SaleModel.findOne({
                attributes: [[sequelize.fn('AVG', sequelize.col('total_amount')), 'averageTransactionValue']],
                where: {
                    transaction_date: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            });
            return result.getDataValue('averageTransactionValue') || 0;
        } catch (error) {
            throw error;
        }
    }

    static async getSalesByCategory(startDate, endDate) {
        try {
            const result = await sequelize.query(`
                SELECT p.category, SUM(o.total_amount) as totalSales
                FROM sales s
                JOIN orders o ON s.order_id = o.id
                JOIN order_items oi ON o.id = oi.order_id
                JOIN products p ON oi.product_id = p.id
                WHERE s.transaction_date BETWEEN :startDate AND :endDate
                GROUP BY p.category
            `, {
                replacements: { startDate, endDate },
                type: sequelize.QueryTypes.SELECT
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async getSalesByPaymentMethod(startDate, endDate) {
        try {
            const result = await SaleModel.findAll({
                attributes: [
                    'payment_method',
                    [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalSales']
                ],
                where: {
                    transaction_date: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                group: ['payment_method']
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async getSalesByTime(startDate, endDate) {
        try {
            const result = await sequelize.query(`
                SELECT DATE_FORMAT(transaction_date, '%H:00') as hour, SUM(total_amount) as totalSales
                FROM sales
                WHERE transaction_date BETWEEN :startDate AND :endDate
                GROUP BY hour
                ORDER BY hour
            `, {
                replacements: { startDate, endDate },
                type: sequelize.QueryTypes.SELECT
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async getTopSellingProducts(startDate, endDate, limit = 10) {
        try {
            const result = await sequelize.query(`
                SELECT p.name, SUM(oi.quantity) as totalQuantity, SUM(oi.price * oi.quantity) as totalSales
                FROM sales s
                JOIN orders o ON s.order_id = o.id
                JOIN order_items oi ON o.id = oi.order_id
                JOIN products p ON oi.product_id = p.id
                WHERE s.transaction_date BETWEEN :startDate AND :endDate
                GROUP BY p.id
                ORDER BY totalQuantity DESC
                LIMIT :limit
            `, {
                replacements: { startDate, endDate, limit: parseInt(limit) },
                type: sequelize.QueryTypes.SELECT
            });
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Sale;