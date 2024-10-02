const Dashboard = require("../models/Dashboard");


class DashboardController {

    static async getDashboardStats(req, res) {
        try {
            const stats = await Dashboard.getDashboardStats();
            res.json(stats);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = DashboardController;
