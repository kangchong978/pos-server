const User = require('../models/User');
const RouteAuth = require('../models/RouteAuth');

async function authMiddleware(req, res, next, routePath) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const [, accessToken] = authHeader.split(' ');

    try {
        const user = await User.findByAccessToken(accessToken);
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Set userId in the request object
        req.userId = user.id;

        // If routePath is provided, check for route-specific authorization
        if (routePath) {
            // Get user roles (assuming user.role is an array or comma-separated string)
            const userRoles = Array.isArray(user.role) ? user.role : user.role.split(',');

            // Check route authorization
            const routeAuth = await RouteAuth.findMatchingRoute(routePath);
            if (routeAuth) {
                const allowedRoles = routeAuth.role.split(',').map((e) => e.trim());
                const isAuthorized = userRoles.some(role =>
                    allowedRoles.includes(role.trim().toLowerCase())
                );

                if (!isAuthorized) {
                    return res.status(403).json({ error: 'Unauthorized access' });
                }
            }
            // If routeAuth is not found, we still continue as the token is valid
        }

        // If we've reached here, either the route doesn't require specific authorization,
        // or the user is authorized for the specific route
        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = authMiddleware;