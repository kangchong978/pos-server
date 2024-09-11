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

}

module.exports = ManageController;