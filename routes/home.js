// Jack
// Created a dedicated file for token verification logic, making it easier to manage and reuse across different routes.

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

router.get('/staff/home', authenticateToken, (req, res) => {
    if (req.user.systemRole === 'STAFF') {
        res.render('staff/home');
    } else {
        res.redirect('/other/home');
    }
});

router.get('/other/home', authenticateToken, (req, res) => {
    res.render('other/home');
});

module.exports = router;
