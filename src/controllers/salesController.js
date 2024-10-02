const Sale = require("../models/Sale");


class SalesController {
    static async recordSale(req, res) {
        try {

            await Sale.recordSale(req.body.orderId, req.body.totalAmount, req.body.taxAmount, req.body.paymentMethod);
            res.json({ message: 'Sale recorded successfully' });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async getTotalSales(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const totalSales = await Sale.getTotalSales(startDate, endDate);
            res.json({ totalSales });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async getAverageTransactionValue(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const averageTransactionValue = await Sale.getAverageTransactionValue(startDate, endDate);
            res.json({ averageTransactionValue });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async getSalesByCategory(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const salesByCategory = await Sale.getSalesByCategory(startDate, endDate);
            res.json({ salesByCategory });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async getSalesByPaymentMethod(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const salesByPaymentMethod = await Sale.getSalesByPaymentMethod(startDate, endDate);
            res.json({ salesByPaymentMethod });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async getSalesByTime(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const salesByTime = await Sale.getSalesByTime(startDate, endDate);
            res.json({ salesByTime });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async getTopSellingProducts(req, res) {
        try {
            const { startDate, endDate, limit } = req.query;
            const topSellingProducts = await Sale.getTopSellingProducts(startDate, endDate, limit);
            res.json({ topSellingProducts });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}

module.exports = SalesController;