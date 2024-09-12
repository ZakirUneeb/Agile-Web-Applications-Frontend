// Zakir
const express = require('express');
const router = express.Router();
const jobRoleController = require('../../controllers/job_role');

router.get('/all_job_roles', jobRoleController.renderAllJobRoles);

router.post('/add_job_role', jobRoleController.create);

router.post('/edit_job_role/:job_role_id', jobRoleController.update);

router.delete('/delete_job_role/:job_role_id', jobRoleController.deleteJobRole);

module.exports = router;
