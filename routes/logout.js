// Jack
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    res.clearCookie('token'); // Clear the JWT token cookie
    res.redirect('/login'); // Redirect to the login page
});

module.exports = router;

