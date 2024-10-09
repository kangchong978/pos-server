const bcrypt = require('bcrypt');
const User = require('../models/User');
const crypto = require('crypto'); // Import crypto for hashing
const RouteAuth = require('../models/RouteAuth');
const EmployeeFeedback = require('../models/EmployeeFeedback');

class AuthService {
    static async login(username, password) {

        const user = await User.findByUsername(username);
        if (!user) {
            throw new Error('Incorrect username / password');
        }

        if (user.password == '' && user.tempPassword == null) {
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

        // Generate a hash for the access token
        const accessToken = crypto.randomBytes(32).toString('hex'); // Create a random access token
        // const hashedToken = crypto.createHash('sha256').update(accessToken).digest('hex'); // Hash the token

        // Store the hashed token in the database
        await User.storeAccessToken(user.id, accessToken); // Assuming you have a method to store the token

        const accessibleRoute = await RouteAuth.getAllowedRoutes(user.role);

        const doneFeedbackToday = await EmployeeFeedback.canSubmitFeedbackToday(user.id);

        return { accessToken, updatePasswordRequired, accessibleRoute, doneFeedbackToday }; // Return the plain access token to the user
    }

    static async register(data) {
        const existingUser = await User.findByUsername(data.username);
        if (existingUser) {
            throw new Error('Email already in use');
        }

        // const hashedPassword = await bcrypt.hash(data.password, 10);
        const tempPassword = Math.random().toString(36).substring(2, 8); // Generate a random 6-character string
        const id = await User.create(data.username, data.email, '', data.phoneNumber, data.role, tempPassword, data.dob, data.gender, data.address);
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

    static async resetPassword(id, data) {
        if (data.newPassword == '') {
            throw new Error('No password provided');

        } else if (data.newPassword != data.newPasswordConfirm) {
            throw new Error('Confirmation password was not match');
        }

        const hashedPassword = await bcrypt.hash(data.newPassword, 10);
        const userId = await User.updatePassword(hashedPassword, id);

    }



    static async removeAccessToken(accessToken) {
        const user = await User.findByAccessToken(accessToken);

        if (user) {
            await User.storeAccessToken(user.id, null); // Assuming you have a method to store the token
            return true;
        }

        return false;
    }
}

module.exports = AuthService;