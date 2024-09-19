const Product = require("../models/Product");
const RouteAuth = require("../models/RouteAuth");

class ProductController {
    static async getProducts(req, res) {
        try {
            const products = await Product.getProducts(req.body.searchTerm, req.body.page, req.body.categoryFilter);
            res.json({ products });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async updateProduct(req, res) {
        try {
            await Product.updateProduct(req.body.id, req.body.name, req.body.image, req.body.category, req.body.description, req.body.price);
            res.json({});
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async createProduct(req, res) {
        try {
            var id = await Product.createProduct(req.body.name, req.body.image, req.body.category, req.body.description, req.body.price, req.body.code);
            res.json({ id });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }




    static async removeProduct(req, res) {
        try {
            await Product.removeProduct(req.body.id);
            res.json({});
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async uploadProductImg(req, res) {
        try {
            var url = await Product.uploadProductImg(req, res);
            res.json({ url });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }



}

module.exports = ProductController;