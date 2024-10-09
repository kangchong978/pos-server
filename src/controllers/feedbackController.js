const EmployeeFeedback = require("../models/EmployeeFeedback");

class FeedbackController {

    static async recordEmployeeFeedback(req, res) {
        try {
            await EmployeeFeedback.recordFeedback(req.userId, req.body.feedbacks);
            res.json({});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getEmployeeFeedbacks(req, res) {
        try {
            const feedbacks = await EmployeeFeedback.getFeedbacks();
            res.json({ feedbacks });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = FeedbackController;