const User = require('../models/User'); // Import User model

/* check wither got valid accessToken */

function authMiddleware(req, res, next, role) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const [, accessToken] = authHeader.split(' ');



    User.findByAccessToken(accessToken) // Assuming you have this method in your User model
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Invalid token' });
            }
            else if (role && !User.checkAuthorized(user, role)) {
                return res.status(401).json({ error: 'Unauthorized access' });
            }
            else {
                req.userId = user.id; // Attach user ID to request
                next();
            }
        })
        .catch(error => {
            return res.status(500).json({ error: error });
        });
}

module.exports = authMiddleware;