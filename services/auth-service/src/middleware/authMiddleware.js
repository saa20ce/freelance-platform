const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        console.log('No token provided');
        return res.status(401).send('Access Denied');
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        console.log(`Authorization successful for user: ${req.user.id}`);
        next();
    } catch (err) {
        console.log('Invalid token:', err.message);
        res.status(400).send('Invalid Token');
    }
};
