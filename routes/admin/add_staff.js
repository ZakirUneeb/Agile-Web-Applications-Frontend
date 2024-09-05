const express = require('express');
const router = express.Router();
const db = require('../../models');
const userController = require('../../controllers/user');

router.post('/', async (req, res) => {
    try {
        await userController.create(req, res);
    } catch (error) {
        console.error('Error adding staff member:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
