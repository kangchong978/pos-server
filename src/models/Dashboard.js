const { sequelize } = require("../config/database");
const { DataTypes, Model, Op } = require('sequelize');

// Assuming you have an Order model defined elsewhere
// If not, you should create one based on your orders table structure
const Order = sequelize.models.Order;

class Dashboard {
    static async getDashboardStats() {
        try {
            // const totalOrders = await Order.count({
            //     where: {
            //         enable: true,
            //         status: 'completed'
            //     }
            // });

            // const totalRevenue = await Order.sum('total', {
            //     where: {
            //         enable: true,
            //         status: 'completed'
            //     }
            // });

            // const totalProductsSold = await Order.sum(
            //     sequelize.fn('JSON_LENGTH', sequelize.fn('JSON_EXTRACT', sequelize.col('products'), '$.products')),
            //     {
            //         where: {
            //             enable: true,
            //             status: 'completed'
            //         }
            //     }
            // );

            // If you need the revenueByDate query, you can uncomment and use this:
            /*
            const revenueByDate = await Order.findAll({
                attributes: [
                    [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                    [sequelize.fn('SUM', sequelize.col('total')), 'revenue']
                ],
                where: { enable: true },
                group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
                order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'DESC']],
                limit: 30
            });
            */

            return {
                totalOrders: 0,
                totalRevenue: 0,
                totalProductsSold: 0,
                // revenueByDate: revenueByDate
            };
        } catch (error) {
            console.error('Error in getDashboardStats:', error);
            throw error;
        }
    }
}

module.exports = Dashboard;