const { DataTypes, Model, Op } = require('sequelize');
const { sequelize } = require("../config/database");
const multer = require('multer');
const path = require('path');
const util = require('util');

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/product/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB size limit
});

class ProductModel extends Model { }

ProductModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING
    },
    category: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    variation: {
        type: DataTypes.TEXT
    },
    enable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true
});

class Product {
    static proceedData(raw) {
        if (!raw) return;

        const processed = raw.toJSON();
        delete processed.enable;

        processed.price = Number(processed.price);

        if (processed.variation) {
            try {
                processed.variation = JSON.parse(processed.variation).variation;
                // Parse variation prices to numbers
                processed.variation = processed.variation.map(v => ({
                    ...v,
                    price: Number(v.price)
                }));
            } catch (error) {
                console.error('Failed to parse variation:', error);
                processed.variation = null;
            }
        }

        if (processed.category) {
            processed.category = processed.category.split(', ').map((category) => category.trim());
        } else {
            processed.category = [];
        }

        if (processed.image) {
            processed.image = processed.image.split(', ').map((image) => image.trim());
        } else {
            processed.image = [];
        }

        return processed;
    }

    static async getProducts(searchTerm, page, categoryFilter, itemsPerPage) {
        try {
            const offset = (page - 1) * itemsPerPage;

            const whereClause = {
                enable: true,
                name: {
                    [Op.like]: `%${searchTerm}%`
                }
            };

            if (categoryFilter) {
                whereClause.category = {
                    [Op.or]: [
                        categoryFilter,
                        { [Op.like]: `${categoryFilter}, %` },
                        { [Op.like]: `%, ${categoryFilter}, %` },
                        { [Op.like]: `%, ${categoryFilter}` }
                    ]
                };
            }

            // Get paginated products
            const products = await ProductModel.findAll({
                where: whereClause,
                limit: itemsPerPage,
                offset: offset
            });

            // Get total count of products matching the criteria
            const totalCount = await ProductModel.count({
                where: whereClause
            });

            return {
                products: products.map((v) => this.proceedData(v)),
                total: totalCount
            };
        } catch (error) {
            throw error;
        }
    }

    static async createProduct(name, image, category, description, price, variation) {
        try {
            const product = await ProductModel.create({
                name,
                image: image.join(', '),
                category: category.join(', '),
                description,
                price: Number(price),
                variation: JSON.stringify({ 'variation': variation.map(v => ({ ...v, price: Number(v.price) })) })
            });
            return product.id;
        } catch (error) {
            throw error;
        }
    }

    static async updateProduct(id, name, image, category, description, price, variation) {
        try {
            await ProductModel.update({
                name,
                image: image.join(', '),
                category: category.join(', '),
                description,
                price: Number(price),
                variation: JSON.stringify({ 'variation': variation.map(v => ({ ...v, price: Number(v.price) })) })
            }, {
                where: { id, enable: true }
            });
        } catch (error) {
            throw error;
        }
    }

    static async removeProduct(id) {
        try {
            await ProductModel.update({ enable: false }, {
                where: { id }
            });
        } catch (error) {
            throw error;
        }
    }

    static async uploadProductImg(req, res) {
        const uploadFile = util.promisify(upload.single('upload-image'));

        try {
            await uploadFile(req, res);

            if (!req.file) {
                throw 'No file uploaded';
            }
            const filePath = req.file.path;
            const fileName = filePath.split('/').pop();
            return fileName;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Product;