// Jack
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const skillController = require('../controllers/skill_enrolment');

router.get('/', authenticateToken, skillController.getUserSkills);

router.get('/view', authenticateToken, skillController.viewSkillDetail);

module.exports = router;
