const { DataTypes, Model, Op } = require('sequelize');
const { sequelize } = require("../config/database");
const Sentiment = require('sentiment');

class EmployeeFeedbackModel extends Model { }

EmployeeFeedbackModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    feedbacks: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    enable: {
        type: DataTypes.BOOLEAN
    }
}, {
    sequelize,
    modelName: 'EmployeeFeedback',
    tableName: 'employee_feedbacks',
    timestamps: false
});

// Assuming you have a User model defined somewhere
const User = sequelize.models.User;

// Define the association
EmployeeFeedbackModel.belongsTo(User, { foreignKey: 'user_id', as: 'user' });


class EmployeeFeedback {
    static async recordFeedback(user_id, feedbacks) {
        try {
            const result = await EmployeeFeedbackModel.create({
                user_id: user_id,
                feedbacks: feedbacks,
            });
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async canSubmitFeedbackToday(user_id) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);  // Set to beginning of the day

            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const existingFeedback = await EmployeeFeedbackModel.findOne({
                where: {
                    user_id: user_id,
                    createdAt: {
                        [Op.gte]: today,
                        [Op.lt]: tomorrow
                    },
                    enable: true
                }
            });

            return existingFeedback != null;  // Return true if no feedback found for today
        } catch (error) {
            console.error('Error checking feedback submission:', error);
            throw error;
        }
    }

    static async getFeedbacks() {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const feedbacks = await EmployeeFeedbackModel.findAll({
                where: {
                    enable: true,
                    createdAt: {
                        [Op.gte]: thirtyDaysAgo
                    }
                },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username']  // Adjust 'username' to match your User model's field name
                }],
                order: [['createdAt', 'DESC']]
            });

            const sentiment = new Sentiment();
            const groupedFeedbacks = {};

            feedbacks.forEach(feedback => {
                const { user_id, feedbacks: feedbackText, createdAt, user } = feedback;
                const sentimentScore = sentiment.analyze(feedbackText).score;

                if (!groupedFeedbacks[user_id]) {
                    groupedFeedbacks[user_id] = {
                        userId: user_id,
                        username: user.username,
                        feedbacks: []
                    };
                }

                groupedFeedbacks[user_id].feedbacks.push({
                    date: createdAt.toISOString().split('T')[0],
                    score: sentimentScore,
                    text: feedbackText
                });
            });

            // Calculate average score for each user over the last 30 days
            const results = Object.values(groupedFeedbacks).map(userFeedback => {
                const totalScore = userFeedback.feedbacks.reduce((sum, feedback) => sum + feedback.score, 0);
                const averageScore = totalScore / userFeedback.feedbacks.length;

                return {
                    userId: userFeedback.userId,
                    username: userFeedback.username,
                    averageScore: parseFloat(averageScore.toFixed(2)),
                    feedbacks: userFeedback.feedbacks
                };
            });

            return results;
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            throw error;
        }
    }
}

module.exports = EmployeeFeedback;