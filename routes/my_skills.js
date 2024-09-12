//Jack
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const fetchExpiringSkills = require('../middleware/getExpiringSkills');
const skillController = require('../controllers/skill_enrolment');

router.get('/', authenticateToken, fetchExpiringSkills, skillController.getUserSkills);

router.get('/view', authenticateToken, fetchExpiringSkills, skillController.viewSkillDetail);

module.exports = router;
