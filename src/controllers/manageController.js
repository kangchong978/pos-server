const RouteAuth = require("../models/RouteAuth");
const Setting = require("../models/Setting");
const User = require("../models/User");

class ManageController {
    static async getUsers(req, res) {
        try {
            const users = await User.getUsers();
            res.json({ users });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
    static async getRoutesAuth(req, res) {
        try {
            const routesAuth = await RouteAuth.getRoutesAuth();
            res.json({ routesAuth });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async updateRoutesAuth(req, res) {
        try {
            const routesAuth = await RouteAuth.updateRoutesAuth(req.body.routesAuth);
            res.status(201).json({});
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async getSettings(req, res) {
        try {
            const settings = await Setting.getSettings();
            res.json({ settings });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateSettings(req, res) {
        try {
            const updatedSettings = await Setting.updateSettings(req.body);
            res.json({ settings: updatedSettings });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async uploadCompanyLogo(req, res) {
        try {
            const logoUrl = await Setting.uploadCompanyLogo(req, res);
            res.json({ url: logoUrl });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ManageController;