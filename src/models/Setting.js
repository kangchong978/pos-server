const multer = require("multer");
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require("../config/database");
const util = require('util');
const path = require("path");

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/company/');
    },
    filename: function (req, file, cb) {
        cb(null, `company-logo-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB size limit
});

class SettingModel extends Model { }

SettingModel.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    company_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    company_logo: {
        type: DataTypes.STRING(255)
    },
    tax: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    address: {
        type: DataTypes.STRING(255)
    },
    email: {
        type: DataTypes.STRING(255)
    },
    website: {
        type: DataTypes.STRING(255)
    },
    phone_number: {
        type: DataTypes.STRING(50)
    },
    receipt_footer_text: {
        type: DataTypes.TEXT
    },
    theme: {
        type: DataTypes.STRING(20)
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'Setting',
    tableName: 'settings',
    timestamps: true
});

class Setting {
    static async getSettings() {
        try {
            const result = await SettingModel.findOne();
            return result ? result.toJSON() : null;
        } catch (error) {
            throw error;
        }
    }

    static async updateSettings(companyInfo) {
        try {
            await SettingModel.update(companyInfo, {
                where: { id: 1 }
            });

            // Fetch the updated record
            const updatedSetting = await SettingModel.findOne({ where: { id: 1 } });

            if (!updatedSetting) {
                throw new Error('No settings found to update');
            }

            return updatedSetting.toJSON();
        } catch (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    }

    static async uploadCompanyLogo(req, res) {
        try {
            const uploadFile = util.promisify(upload.single('company-logo'));

            await uploadFile(req, res);

            if (!req.file) {
                throw 'No file uploaded';
            }
            const filePath = req.file.path;
            const fileName = filePath.split('/').pop();
            return `/img/company/${fileName}`; // Return the relative path
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Setting;