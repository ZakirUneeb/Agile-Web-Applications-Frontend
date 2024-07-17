const express = require('express');
const router = express.Router();
const controller = require('../controllers/skill_enrolment.js');

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:skill_enrolment_id', controller.getById);
router.get('/:user_id', controller.getById);
router.get('/:skill_strength_id', controller.getById);
router.put('/', controller.update);
router.delete('/:skill_strength_id', controller.deleteEnrolment);

module.exports = router;