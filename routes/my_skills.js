//Jack
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const fetchExpiringSkills = require('../middleware/getExpiringSkills');
const skillController = require('../controllers/skill_enrolment');

router.get('/', authenticateToken, fetchExpiringSkills, skillController.getUserSkills);
router.get('/view', authenticateToken, fetchExpiringSkills, skillController.viewSkillDetail);

router.post('/add', authenticateToken, async (req, res) => {
    try {
        await skillController.create(req, res);
    } catch (error) {
        console.error("Error adding skill enrolment:", error);
        res.status(500).send('Error adding skill');
    }
});

module.exports = router;
