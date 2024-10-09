const Order = require("../models/Order");
const Setting = require("../models/Setting");
const Table = require("../models/Table");
const ReceiptGenerator = require("../utils/receiptGenerator");
const fs = require('fs');

class OrderController {

    static async getOrders(req, res) {
        try {
            const filters = {
                status: req.query.status,
                id: req.query.id
            };
            const orders = await Order.getOrders(filters);
            res.json({ orders });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }


    static async getTables(req, res) {
        try {
            const tables = await Table.getTables();
            res.json({ tables });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async updateTablePosition(req, res) {
        try {
            await Table.updateTablePosition(req.body.id, req.body.x, req.body.y);
            res.json({});
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async updateTableOrderId(req, res) {
        try {
            await Table.updateTableOrderId(req.body.id, req.body.orderId);
            res.json({});
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
    static async createTable(req, res) {
        try {
            await Table.createTable(req.body.tableName);
            res.json({});
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
    static async removeTable(req, res) {
        try {
            await Table.removeTable(req.body.id);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createOrder(req, res) {
        try {
            var id = await Order.createOrder(req.body.orderType, req.body.tableId, req.body.tableName);
            res.json({ id });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async updateOrderStatus(req, res) {
        try {
            await Order.updateOrderStatus(req.body.id, req.body.status);
            res.json({});
        } catch (error) {
            res.status(401).json({ error: error.message });
        }

    }

    static async updateOrder(req, res) {
        try {
            await Order.updateOrder(req.body.id, req.body.orderType, req.body.products, req.body.subTotal, req.body.tax, req.body.total, req.body.tableId);
            res.json({});
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
    static async generateOrderList(req, res) {
        try {
            const orderId = req.params.id;
            const order = await Order.getOrderById(orderId);

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            // Fetch company information
            const companyInfo = await Setting.getSettings();

            const receiptPath = await ReceiptGenerator.generateOrderList(order, companyInfo);

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

module.exports = OrderController;