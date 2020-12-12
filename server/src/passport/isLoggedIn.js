const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ 'statusCode': 401, 'message': 'not authenticated' });
};

module.exports = isLoggedIn;
