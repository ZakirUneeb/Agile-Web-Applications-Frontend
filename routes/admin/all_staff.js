const express = require('express');
const router = express.Router();
const db = require('../../models');
const User = db.user;
const Department = db.department;
const JobRole = db.jobRole;
const SystemRole = db.systemRole;

router.get('/', async (req, res) => {
    try {
        const staffMembers = await User.findAll({
            include: [
                { model: Department, as: 'department' },
                { model: JobRole, as: 'jobRole' },
                { model: SystemRole, as: 'systemRole' }
            ]
        });

        const jobRoles = await JobRole.findAll();
        const departments = await Department.findAll();
        const systemRoles = await SystemRole.findAll();

        res.render('admin/all_staff', {
            staffMembers,
            jobRoles,
            departments,
            systemRoles  
        });
    } catch (error) {
        console.error('Error fetching staff members:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
