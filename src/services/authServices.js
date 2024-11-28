const bcrypt = require('bcrypt');
const User = require('../models/User');
const RouteAuth = require('../models/RouteAuth');
const EmployeeFeedback = require('../models/EmployeeFeedback');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('./jwtServices');


class AuthService {

    static async loadUserInfo(id) {
        const user = await User.findById(id);
        const accessibleRoute = await RouteAuth.getAllowedRoutes(user.role);
        const doneFeedbackToday = await EmployeeFeedback.canSubmitFeedbackToday(user.id);
        const profile = User.proceedData(user);
        return { profile, accessibleRoute, doneFeedbackToday };
    }

    static async login(username, password) {

        const user = await User.findByUsername(username);
        if (!user) {
            throw new Error('Incorrect username / password');
        }

        if (user.password == null && user.tempPassword == null) {
            throw new Error('Something went wrong');
        }

        var verifyTemp = user.tempPassword != null;
        var updatePasswordRequired = false;

        if (verifyTemp) {
            const isTempPasswordValid = user.tempPassword == password;
            if (!isTempPasswordValid) {
                throw new Error('Incorrect username / password');
            }
            updatePasswordRequired = true;
        } else {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Incorrect username / password');
            }
        }

        const accessibleRoute = await RouteAuth.getAllowedRoutes(user.role);

        const userId = user.id;
        const refresh_token_ver = new Date().getTime();
        await User.updateRefreshTokenVer(userId, refresh_token_ver);
        const accessTokenPayload = { accessibleRoute, userId, refresh_token_ver };

        const accessToken = generateAccessToken(accessTokenPayload);
        const refreshTokenPayload = { userId, refresh_token_ver };
        const refreshToken = generateRefreshToken(refreshTokenPayload);

        const doneFeedbackToday = await EmployeeFeedback.canSubmitFeedbackToday(user.id);
        const profile = User.proceedData(user);

        return { profile, refreshToken, accessToken, updatePasswordRequired, accessibleRoute, doneFeedbackToday }; // Return the plain access token to the user
    }

    static async register(data) {
        const existingUser = await User.findByUsername(data.username);
        if (existingUser) {
            throw new Error('Email already in use');
        }

        const tempPassword = Math.random().toString(36).substring(2, 8); // Generate a random 6-character string
        const id = await User.create({
            username: data.username,
            email: data.email,
            phoneNumber: data.phoneNumber,
            role: data.role,
            tempPassword: tempPassword,
            dob: data.dob,
            gender: data.gender,
            address: data.address
        });
        return { id, tempPassword };
    }

    static async remove(data) {
        const userId = await User.remove(data.id);
        return userId;
    }

    static async updateUser(data) {
        const userId = await User.update(data.email, data.phoneNumber, data.role, data.id, data.dob, data.gender, data.address);
        return userId;
    }

    static async requestResetPassword(id) {
        const tempPassword = Math.random().toString(36).substring(2, 8); // Generate a random 6-character string
        await User.updateTempPassword(tempPassword, id);
        return { id, tempPassword };
    }

    static async resetPassword(id, data) {
        if (!data.newPassword || data.newPassword == '') {
            throw new Error('No password provided');

        } else if (data.newPassword != data.newPasswordConfirm) {
            throw new Error('Confirmation password was not match');
        }

        const hashedPassword = await bcrypt.hash(data.newPassword, 10);
        const userId = await User.updatePassword(hashedPassword, id);
    }

    static async logout(id) {
        await User.updateRefreshTokenVer(id, null);
        return true;
    }

    static async refreshAccessToken(refreshToken) {
        const { userId, refresh_token_ver } = verifyRefreshToken(refreshToken);
        const user = await User.findById(userId);
        const accessibleRoute = await RouteAuth.getAllowedRoutes(user.role);
        const accessTokenPayload = { accessibleRoute, userId, refresh_token_ver };
        const accessToken = generateAccessToken(accessTokenPayload);
        return { accessToken };
    }
}

module.exports = AuthService;