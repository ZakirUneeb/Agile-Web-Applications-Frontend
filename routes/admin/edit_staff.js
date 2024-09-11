// Zakir
const express = require('express');
const router = express.Router();
const db = require('../../models');
const User = db.user;
const Department = db.department;
const JobRole = db.jobRole;
const SystemRole = db.systemRole;

router.get('/:user_id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.user_id, {
            include: [
                { model: Department, as: 'department' },
                { model: JobRole, as: 'jobRole' },
                { model: SystemRole, as: 'systemRole' }
            ]
        });
        res.json(user);
    } catch (error) {
        console.error('Error fetching staff member:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/:user_id', async (req, res) => {
    try {
        const { first_name, last_name, email, department_id, job_role_id, system_role_id } = req.body;

        const updatedUser = await User.update(
            { first_name, last_name, email, department_id, job_role_id, system_role_id },
            { where: { user_id: req.params.user_id }, returning: true, plain: true }
        );

        const fullUpdatedUser = await User.findByPk(req.params.user_id, {
            include: [
                { model: Department, as: 'department' },
                { model: JobRole, as: 'jobRole' },
                { model: SystemRole, as: 'systemRole' }
            ]
        });

        res.status(200).json(fullUpdatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
