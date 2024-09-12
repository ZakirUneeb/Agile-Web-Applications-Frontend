// Zakir
const express = require('express');
const router = express.Router();
const jobRoleController = require('../../controllers/job_role');

router.get('/view_staff_by_jobrole/:job_role_id', jobRoleController.renderStaffByJobRole);

module.exports = router;
