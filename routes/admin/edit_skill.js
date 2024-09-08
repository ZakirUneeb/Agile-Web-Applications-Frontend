// Zakir
const express = require('express');
const router = express.Router();
const skillController = require('../../controllers/skill');

router.post('/:skill_id', async (req, res) => {
    try {
        await skillController.update(req, res);
    } catch (error) {
        res.status(500).send("Error updating the skill.");
    }
});

module.exports = router;