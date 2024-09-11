// Zakir
const express = require('express');
const router = express.Router();
const skillEnrolmentController = require('../../controllers/skill_enrolment');

router.get('/:user_id', skillEnrolmentController.renderSkillsByUserId);

module.exports = router;
