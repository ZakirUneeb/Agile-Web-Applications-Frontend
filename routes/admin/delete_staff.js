// Zakir
const express = require('express');
const router = express.Router();
const db = require('../../models');
const User = db.user;

router.delete('/:user_id', async (req, res) => {
    try {
        const userId = req.params.user_id;

        const result = await User.destroy({
            where: { user_id: userId }
        });

        if (result === 0) {
            return res.status(404).send('User not found or already deleted');
        }

        res.status(200).send('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
