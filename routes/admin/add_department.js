// Zakir
const express = require('express');
const router = express.Router();
const departmentController = require('../../controllers/departments');

router.post('/', departmentController.create);

module.exports = router;