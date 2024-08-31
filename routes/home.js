// Jack
// Created a dedicated file for token verification logic, making it easier to manage and reuse across different routes.

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const db = require('../models');
const userController = require('../controllers/user');
const User = db.user;
const Department = db.department;
const JobRole = db.jobRole;
const SystemRole = db.systemRole;

router.get('/home', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({
            where: { user_id: req.user.userId },
            include: [
                { model: Department, as: 'department', attributes: ['department_name'] },
                { model: JobRole, as: 'jobRole', attributes: ['job_role_name'] },
                { model: SystemRole, as: 'systemRole', attributes: ['system_role_name'] }
            ]
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        let viewName;
        switch (user.systemRole.system_role_name.toUpperCase()) {
            case 'MANAGER':
                viewName = 'manager/manager_home';
                break;
            case 'ADMIN':
                viewName = 'common/home';
                break;
            default:
                viewName = 'common/home';
        }

        res.render(viewName, {
            user: {
                first_name: user.first_name,
                systemRole: user.systemRole.system_role_name
            }
        });
    } catch (error) {
        console.error('Error fetching home:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/profile', authenticateToken, async (req, res) => {
    req.params.user_id = req.user.userId;

    userController.getById(req, {
        status: (statusCode) => ({
            json: (user) => {
                if (statusCode === 200) {
                    res.render('common/profile', { user });
                } else {
                    res.status(statusCode).send(user); 
                }
            }
        }),
        send: (message) => res.status(500).send(message)
    });
});

module.exports = router;
