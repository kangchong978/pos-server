const Order = require("../models/Order");
const Sale = require("../models/Sale");
const Setting = require("../models/Setting");
const ReceiptGenerator = require("../utils/receiptGenerator");
const fs = require('fs');

class SalesController {
    static async recordSale(req, res) {
        try {
            await Sale.recordSale(req.body.orderId, req.body.totalAmount, req.body.taxAmount, req.body.paymentMethod);
            res.json({ message: 'Sale recorded successfully' });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async getSales(req, res) {
        try {
            const filters = {
                status: req.query.status,
                id: req.query.id
            };
            const sales = await Sale.getSales(filters);
            res.json({ sales });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async generateReceipt(req, res) {
        try {
            const saleId = req.params.id;

            const sale = await Sale.getSaleById(saleId);

            const orderId = sale.order_id;


            const order = await Order.getOrderById(orderId);

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            // Fetch company information
            const companyInfo = await Setting.getSettings();

            const receiptPath = await ReceiptGenerator.generateReceipt(order, companyInfo);

            // Send the file
            res.download(receiptPath, `receipt-${orderId}.pdf`, (err) => {
                if (err) {
                    res.status(500).json({ error: 'Error downloading the file' });
                }

                // Delete the file after sending
                fs.unlink(receiptPath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting the file:', unlinkErr);
                    }
                });
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = SalesController;