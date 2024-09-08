// Zakir
const express = require('express');
const router = express.Router();
const skillController = require('../../controllers/skill');

router.post('/', async (req, res) => {
    try {
        await skillController.create(req, res);
    } catch (error) {
        res.status(500).send("Error adding the new skill.");
    }
});

module.exports = router;