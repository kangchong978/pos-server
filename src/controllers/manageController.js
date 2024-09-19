const RouteAuth = require("../models/RouteAuth");
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
}

module.exports = ManageController;