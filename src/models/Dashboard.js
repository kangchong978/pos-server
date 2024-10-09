const { sequelize } = require("../config/database");
const { DataTypes, Model, Op } = require('sequelize');

class Dashboard {
    static async getDashboardStats(startDate, endDate) {
        const Sale = sequelize.models.Sale;
        const Order = sequelize.models.Order;

        try {
            // Total Revenue, Orders, and Products Sold for the given date range
            const totals = await Sale.findOne({
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalRevenue'],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders'],
                ],
                where: {
                    transaction_date: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                raw: true
            });

            const totalRevenue = Number(totals.totalRevenue) || 0;
            const totalOrders = Number(totals.totalOrders) || 0;

            // Sales Overview Graph (Revenue vs Time) for the given date range
            const rawSalesOverview = await Sale.findAll({
                attributes: [
                    [sequelize.fn('DATE', sequelize.col('transaction_date')), 'date'],
                    [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue']
                ],
                where: {
                    transaction_date: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                group: [sequelize.fn('DATE', sequelize.col('transaction_date'))],
                order: [[sequelize.fn('DATE', sequelize.col('transaction_date')), 'ASC']],
                raw: true
            });
            const salesOverview = rawSalesOverview.map((v) => {
                return { date: v.date, revenue: Number(v.revenue) }
            });


            // Top-Selling Menu Items for the given date range
            const orders = await Order.findAll({
                attributes: ['products', 'createdAt'],
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                raw: true
            });

            const productCounts = {};
            let totalProductsSold = 0;
            orders.forEach(order => {
                try {
                    const products = JSON.parse(order.products).products;
                    products.forEach(product => {
                        if (productCounts[product.name]) {
                            productCounts[product.name] += product.quantity;
                        } else {
                            productCounts[product.name] = product.quantity;
                        }
                        totalProductsSold += product.quantity;
                    });
                } catch (error) {
                    console.error('Error parsing products:', error);
                }
            });

            const topSellingItems = Object.entries(productCounts)
                .map(([name, quantity]) => ({ name, quantity }))
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 5);

            // Daily Transactions Volume for the given date range
            const dailyTransactions = await Sale.findAll({
                attributes: [
                    [sequelize.fn('DATE', sequelize.col('transaction_date')), 'date'],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
                ],
                where: {
                    transaction_date: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                group: [sequelize.fn('DATE', sequelize.col('transaction_date'))],
                order: [[sequelize.fn('DATE', sequelize.col('transaction_date')), 'ASC']],
                raw: true
            });

            return {
                totalRevenue,
                totalOrders,
                totalProductsSold,
                salesOverview,
                topSellingItems,
                dailyTransactions
            };
        } catch (error) {
            console.error('Error in getDashboardStats:', error);
            throw error;
        }
    }
}

module.exports = Dashboard;