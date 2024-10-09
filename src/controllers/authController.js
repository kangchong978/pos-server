const User = require('../models/User');
const AuthService = require('../services/authServices');

class AuthController {
    static async login(req, res) {
        try {
            const { username, password } = req.body;
            const { updatePasswordRequired, accessibleRoute, doneFeedbackToday } = await AuthService.login(username, password);

            /* new access Token was stored */
            const userInfo = await User.findByUsername(username);

            /* remove the password from object */
            res.status(201).json({ ...User.proceedData(userInfo), updatePasswordRequired, accessibleRoute, doneFeedbackToday });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async register(req, res) {
        try {

            const { id, tempPassword } = await AuthService.register(req.body);
            res.status(201).json({ id, tempPassword });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async remove(req, res) {
        try {
            await AuthService.remove(req.body);
            res.status(201).json(true);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }


    static async updateUser(req, res) {
        try {
            await AuthService.updateUser(req.body);
            res.status(201).json(true);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async resetPassword(req, res) {
        try {
            await AuthService.resetPassword(req.userId, req.body);
            res.status(201).json(true);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async logout(req, res) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ error: 'No token provided' });
            }

            const [, accessToken] = authHeader.split(' ');

            await AuthService.removeAccessToken(accessToken);
            res.status(201).json({ 'message': 'succeed' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = AuthController;