// Zakir
const express = require('express');
const router = express.Router();
const skillController = require('../../controllers/skill');

router.delete('/:skill_id', async (req, res) => {
    try {
        await skillController.deleteSkill(req, res);
    } catch (error) {
        res.status(500).send("Error deleting the skill.");
    }
});

module.exports = router;