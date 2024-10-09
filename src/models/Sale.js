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
    static proceedData(raw) {
        if (!raw) return null;
        const processed = raw.toJSON();
        delete processed.enable;

        processed.total_amount = Number(processed.total_amount);
        processed.tax_amount = Number(processed.tax_amount);

        processed.createdAt = new Date(processed.createdAt);
        processed.updatedAt = new Date(processed.updatedAt);

        return processed;
    }

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

    static async getSales(filters = {}) {
        try {
            const whereClause = { enable: true };

            if (filters.status) {
                whereClause.status = filters.status;
            }

            if (filters.id) {
                whereClause.id = filters.id;
            }

            const sales = await SaleModel.findAll({
                where: whereClause,
                order: [['updatedAt', 'DESC']]
            });

            return sales.map((v) => this.proceedData(v));
        } catch (error) {
            throw error;
        }
    }

    static async getSaleById(id) {
        try {
            const sale = await SaleModel.findOne({
                where: { id, enable: true }
            });
            return sale ? this.proceedData(sale) : null;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Sale;