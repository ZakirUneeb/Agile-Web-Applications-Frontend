// File: C:\repos\Agile-Web-Applications-Frontend\routes\login.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/login');

// Serve the login page on GET /login
router.get('/', (req, res) => {
    res.render('login', { query: req.query })
});

// Handle the login form submission on POST /login
router.post('/', controller.login);  // Note the POST route is just '/'

module.exports = router;
