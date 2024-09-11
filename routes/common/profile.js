const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticateToken');
const userController = require('../../controllers/user');

// GET: Render the profile page with user details (using the controller)
router.get('/', authenticateToken, async (req, res) => {
    req.params.user_id = req.user.userId;  // Set the logged-in user's ID as the parameter
    await userController.getById(req, res);  // Call the controller function
});

// POST: Update user profile (using the controller's update function)
router.post('/', authenticateToken, async (req, res) => {
    req.body.user_id = req.user.userId;  // Ensure the logged-in user's ID is used for the update
    await userController.update(req, res);  // Call the controller function
});

module.exports = router;
