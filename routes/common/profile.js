// Jack
const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticateToken');
const db = require('../../models');
const bcrypt = require('bcrypt');
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

router.post('/', authenticateToken, async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    try {
        const user = await User.findOne({ where: { user_id: req.user.userId } });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const updatedData = {
            first_name: first_name || user.first_name,
            last_name: last_name || user.last_name,
            email: email || user.email
        };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }
        await User.update(updatedData, { where: { user_id: user.user_id } });

        res.redirect('/profile');
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
