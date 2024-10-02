const ProductCategory = require("../models/ProductCategory");

class ProductCategoryController {
    static async getCategories(req, res) {
        try {
            const categories = await ProductCategory.getProdcutCategories();
            res.json({ categories });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }


    static async createCategory(req, res) {
        try {
            var id = await ProductCategory.createProductCategory(req.body.name);
            res.json({ id });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async removeCategory(req, res) {
        try {
            await ProductCategory.removeProductCategory(req.body.id);
            res.json({});
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

}


module.exports = ProductCategoryController;