// Jack
const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the token stored in the cookie
    res.redirect('/login');
});

module.exports = router;
