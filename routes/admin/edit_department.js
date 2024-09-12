// Zakir
const express = require('express');
const router = express.Router();
const departmentController = require('../../controllers/departments');

router.post('/:department_id', departmentController.update);

module.exports = router;
