// Jack
const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticateToken');
const db = require('../../models');
const User = db.user;

router.get('/', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({
            where: { user_id: req.user.userId },
            include: [
                { model: db.department, as: 'department', attributes: ['department_name'] },
                { model: db.jobRole, as: 'jobRole', attributes: ['job_role_name'] },
                { model: db.systemRole, as: 'systemRole', attributes: ['system_role_name'] }
            ]
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('common/profile', { user });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
