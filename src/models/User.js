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
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    accessToken: {
        type: DataTypes.STRING(255)
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

    static checkAuthorized(user, role) {
        return user.role.includes(role);
    }

    static async getUsers() {
        try {
            const users = await UserModel.findAll({ where: { enable: true } });
            return users.map((v) => this.proceedData(v));
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

    static async findByAccessToken(accessToken) {
        try {
            const user = await UserModel.findOne({ where: { accessToken, enable: true } });
            return user ? this.proceedData(user) : null;
        } catch (error) {
            throw error;
        }
    }

    static async create(username, email, password, phoneNumber, role, tempPassword, dob, gender, address) {
        try {
            const user = await UserModel.create({
                username, email, password, phoneNumber, role, tempPassword, dob, gender, address
            });
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

    static async storeAccessToken(userId, hashedToken) {
        try {
            await UserModel.update(
                { accessToken: hashedToken },
                { where: { id: userId, enable: true } }
            );
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;