// Zakir
const express = require('express');
const router = express.Router();
const departmentController = require('../../controllers/departments');

router.delete('/', departmentController.deleting);

module.exports = router;