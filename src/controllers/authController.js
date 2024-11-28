const User = require('../models/User');
const AuthService = require('../services/authServices');

class AuthController {


    static async login(req, res) {
        try {
            const { username, password } = req.body;
            const props = await AuthService.login(username, password);

            res.status(201).json(props);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async register(req, res) {
        try {
            const props = await AuthService.register(req.body);
            res.status(201).json(props);
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

    static async loadUserInfo(req, res) {
        try {
            const userId = req.userId;
            const props = await AuthService.loadUserInfo(userId);
            res.status(201).json(props);
        } catch (error) {
            res.status(401).json({ error: error.message });
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

    static async requestResetPassword(req, res) {
        try {
            const props = await AuthService.requestResetPassword(req.body.id);
            res.status(201).json(props);
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
            await AuthService.logout(req.userId);

            res.status(201).json({ 'message': 'succeed' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async refreshAccessToken(req, res) {
        try {
            var accessToken = await AuthService.refreshAccessToken(req.body.refreshToken);

            res.status(201).json(accessToken);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = AuthController;