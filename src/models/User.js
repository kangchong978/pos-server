const { DataTypes, Model } = require('sequelize');
const { sequelize } = require("../config/database");

class UserModel extends Model { }

UserModel.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    refresh_token_ver: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    phoneNumber: {
        type: DataTypes.STRING(255)
    },
    role: {
        type: DataTypes.STRING(255)
    },
    enable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    tempPassword: {
        type: DataTypes.STRING(255)
    },
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true
    },
    address: {
        type: DataTypes.STRING(500),
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
});

class User {
    static proceedData(raw) {
        if (!raw) return;
        const { password, tempPassword, enable, ...processed } = raw.toJSON();
        return processed;
    }


    static async getUsers() {
        try {
            const users = await UserModel.findAll({ where: { enable: true } });
            return users.map((v) => this.proceedData(v));
        } catch (error) {
            throw error;
        }
    }
    static async findById(id) {
        try {
            return await UserModel.findOne({ where: { id, enable: true } });
        } catch (error) {
            throw error;
        }
    }

    static async findByUsername(username) {
        try {
            return await UserModel.findOne({ where: { username, enable: true } });
        } catch (error) {
            throw error;
        }
    }


    static async create(data) {
        try {
            const user = await UserModel.create(data);
            return user.id;
        } catch (error) {
            throw error;
        }
    }

    static async remove(userId) {
        try {
            await UserModel.update(
                { accessToken: '', enable: false },
                { where: { id: userId, enable: true } }
            );
        } catch (error) {
            throw error;
        }
    }

    static async update(email, phoneNumber, role, id, dob, gender, address) {
        try {
            await UserModel.update(
                { email, phoneNumber, role, dob, gender, address },
                { where: { id, enable: true } }
            );
        } catch (error) {
            throw error;
        }
    }


    static async updateTempPassword(tempPassword, id) {
        try {
            await UserModel.update(
                { tempPassword, password: null, refresh_token_ver: null },
                { where: { id, enable: true } }
            );
        } catch (error) {
            throw error;
        }
    }


    static async updatePassword(password, id) {
        try {
            await UserModel.update(
                { password, tempPassword: null },
                { where: { id, enable: true } }
            );
        } catch (error) {
            throw error;
        }
    }

    static async updateRefreshTokenVer(userId, refresh_token_ver) {
        try {
            await UserModel.update(
                { 'refresh_token_ver': refresh_token_ver },
                { where: { id: userId, enable: true } }
            );
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;