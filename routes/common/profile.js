// Jack
const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticateToken');
const userController = require('../../controllers/user');

router.get('/', authenticateToken, async (req, res) => {
    req.params.user_id = req.user.userId; 
    await userController.getById(req, res);
});

router.post('/', authenticateToken, async (req, res) => {
    req.body.user_id = req.user.userId;
    await userController.update(req, res);
});

module.exports = router;
