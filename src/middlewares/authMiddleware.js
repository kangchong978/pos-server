const User = require('../models/User');
const RouteAuth = require('../models/RouteAuth');
const { verifyAccessToken, verifyRefreshToken } = require('../services/jwtServices');


async function authMiddleware(req, res, next, routePath, ignoreVer = false, isRefreshToken = false) {

    if (isRefreshToken) {
        const token = req.body.refreshToken;
        try {
            var { userId, refresh_token_ver } = verifyRefreshToken(token);
            var user = await User.findById(userId);
            if (user.refresh_token_ver != refresh_token_ver) {
                return res.sendStatus(401);
            }

            next();
        } catch (error) {
            if ((error || error.message) == 'invalid token') return res.sendStatus(401);
            if ((error || error.message) == 'jwt expired') return res.sendStatus(401);
            return res.status(500).json({ error: error });
        }
        return;
    }

    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    try {
        var { accessibleRoute, userId, refresh_token_ver } = verifyAccessToken(token);
        if (!accessibleRoute) throw 'Unknown Error';

        var user = await User.findById(userId);

        /* only skip this, if the jwt token expired wont passed here, this only handle the logout case */
        if (!ignoreVer && user.refresh_token_ver != refresh_token_ver) throw 'jwt expired';

        if (routePath) {
            const isAuthorized = accessibleRoute.some(routeAuth => routeAuth.route == routePath);

            if (!isAuthorized) {
                return res.status(403).json({ error: 'Unauthorized access' });
            }
        }

        req.userId = userId;
        next();
    } catch (error) {
        if ((error == 'invalid token') || (error.message == 'invalid token')) return res.sendStatus(401);
        if ((error == 'jwt expired') || (error.message == 'jwt expired')) return res.sendStatus(401);
        return res.status(500).json({ error: error });
    }
}


module.exports = authMiddleware;