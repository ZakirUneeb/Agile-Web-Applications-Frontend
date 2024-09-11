// Zakir
const express = require('express');
const router = express.Router();
const controller = require('../controllers/skill_enrolment');

router.put('/', controller.update);
router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:skill_enrolment_id', controller.getById);
router.get('/user/:user_id', controller.getByUserId);
router.get('/strength/:skill_strength_id', controller.getByStrengthId);
router.delete('/:skill_enrolment_id', controller.deleteEnrolment);

router.post('/add', controller.create);
router.post('/update', controller.update);

module.exports = router;
