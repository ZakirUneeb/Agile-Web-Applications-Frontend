const controller = require('../controllers/login');
const express = require('express');
var router = express.Router();

router.post('/login', controller.login);

module.exports = router;