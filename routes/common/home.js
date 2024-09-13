const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticateToken');
const { getExpiringSkills } = require('../../controllers/skill_enrolment');
const db = require('../../models');
const User = db.user;
const SkillEnrolment = db.skillEnrolment;
const Skill = db.skill;
const SkillStrength = db.skillStrength;

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

        const skillEnrollments = await SkillEnrolment.findAll({
            where: { user_id: req.user.userId },
            include: [
                { model: Skill, as: 'skill', attributes: ['skill_name'] },
                { model: SkillStrength, as: 'skillStrength', attributes: ['skill_strength_name'] }
            ]
        });

        const userSkillData = skillEnrollments.reduce((acc, enrollment) => {
            const skillName = enrollment.skill.skill_name;
            if (!acc[skillName]) {
                acc[skillName] = 1;
            } else {
                acc[skillName]++;
            }
            return acc;
        }, {});

        const userSkillDataArray = Object.keys(userSkillData).map(skill_name => ({
            skill_name,
            enrollmentCount: userSkillData[skill_name]
        }));

        const skillStrengthData = skillEnrollments.reduce((acc, enrollment) => {
            const strength = enrollment.skillStrength ? enrollment.skillStrength.skill_strength_name : 'Unknown';
            if (!acc[strength]) {
                acc[strength] = 1;
            } else {
                acc[strength]++;
            }
            return acc;
        }, {});

        const skillStrengthDataArray = Object.keys(skillStrengthData).map(strength => ({
            strength,
            count: skillStrengthData[strength]
        }));

        let viewName = 'common/home';
        if (user.systemRole.system_role_name.toUpperCase() === 'ADMIN') {
            viewName = 'admin/admin_home';
        }

        res.render(viewName, {
            user,
            expiringSkills,
            userSkillData: userSkillDataArray, 
            skillStrengthData: skillStrengthDataArray,
            currentPage: 'home'
        });
    } catch (error) {
        console.error('Error fetching home:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
