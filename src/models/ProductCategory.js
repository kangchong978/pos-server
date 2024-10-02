const { DataTypes, Model, Op } = require('sequelize');
const { sequelize } = require("../config/database");

class ProductCategoryModel extends Model { }

ProductCategoryModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    enable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'ProductCategory',
    tableName: 'products_categories',
    timestamps: true
});

class ProductCategory {
    static proceedData(raw) {
        if (!raw) return;
        const processed = raw.toJSON();
        delete processed.enable;
        return processed;
    }

    static async getProdcutCategories() {
        try {
            const result = await ProductCategoryModel.findAll({
                where: { enable: true }
            });
            return result.map((v) => this.proceedData(v));
        } catch (error) {
            throw error;
        }
    }

    static async createProductCategory(name) {
        try {
            // Check if the category exists (case-insensitive)
            const existingCategory = await ProductCategoryModel.findOne({
                where: {
                    name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', name.toLowerCase()),
                    enable: true
                }
            });

            if (existingCategory) {
                // Return the ID of the existing category
                return existingCategory.id;
            }

            // Insert the new category if it doesn't exist
            const newCategory = await ProductCategoryModel.create({ name });
            return newCategory.id;

        } catch (error) {
            throw error;
        }
    }

    static async removeProductCategory(id) {
        try {
            await ProductCategoryModel.update(
                { enable: false },
                { where: { id } }
            );
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProductCategory;