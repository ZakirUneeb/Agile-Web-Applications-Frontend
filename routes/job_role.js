const express = require('express');
const router = express.Router();
const controller = require('../controllers/job_role');

router.get('/', controller.getAll);
router.get('/name', controller.getByName);
router.get('/:job_role_id', controller.getById);
router.post('/', controller.create);
router.put('/', controller.update);
router.delete('/:job_role_id', controller.deleteJobRole);

module.exports = router;