// File: C:\repos\Agile-Web-Applications-Frontend\middleware\authenticateToken.js

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;  // Using cookies to get the token

    if (!token) {
        return res.redirect('/login');  // Redirect to login if no token is found
    }

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.redirect('/login');  // Redirect if token is invalid
        }
        req.user = user;  // Attach user info to the request
        next();  // Continue to the next middleware or route handler
    });
};

module.exports = authenticateToken;
