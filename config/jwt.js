const jwt = require('jsonwebtoken');

const secretKey = 'dungeon';

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403); 
        }
        req.user = user;
        next();
    });
}

function generateToken(userId) {
    return jwt.sign({ id: userId }, secretKey, { expiresIn: '1h' });
}

module.exports = {
    authenticateToken,
    generateToken
};