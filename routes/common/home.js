// Jack
const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticateToken');
const { getExpiringSkills } = require('../../controllers/skill_enrolment');
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

        const expiringSkills = await getExpiringSkills(req.user.userId);

        let viewName = 'common/home';
        if (user.systemRole.system_role_name.toUpperCase() === 'ADMIN') {
            viewName = 'admin/admin_home';
        }

        res.render(viewName, { user, expiringSkills, currentPage: 'home' });
    } catch (error) {
        console.error('Error fetching home:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
