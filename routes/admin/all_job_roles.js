// Zakir
const express = require('express');
const router = express.Router();
const jobRoleController = require('../../controllers/job_role');

router.get('/', jobRoleController.renderAllJobRoles);

router.post('/add', jobRoleController.create);

router.post('/edit/:job_role_id', jobRoleController.update);

router.delete('/delete/:job_role_id', jobRoleController.deleteJobRole);

module.exports = router;
