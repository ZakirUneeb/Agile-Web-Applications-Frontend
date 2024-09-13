const express = require('express');
const router = express.Router();
const jobRoleController = require('../../controllers/job_role');

router.get('/:job_role_id', jobRoleController.renderStaffByJobRole);

module.exports = router;
