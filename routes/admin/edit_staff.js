const express = require('express');
const router = express.Router();
const db = require('../../models');
const User = db.user;
const Department = db.department;
const JobRole = db.jobRole;
const SystemRole = db.systemRole;

// Get specific staff details (for editing)
router.get('/:user_id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.user_id, {
            include: [
                { model: Department, as: 'department' },
                { model: JobRole, as: 'jobRole' },
                { model: SystemRole, as: 'systemRole' }
            ]
        });
        res.json(user);  // Return user details as JSON
    } catch (error) {
        console.error('Error fetching staff member:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Update specific staff details
router.post('/:user_id', async (req, res) => {
    try {
        const { first_name, last_name, email, department_id, job_role_id, system_role_id } = req.body;
        await User.update(
            { first_name, last_name, email, department_id, job_role_id, system_role_id },
            { where: { user_id: req.params.user_id } }
        );
        res.status(200).send('User updated successfully');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
