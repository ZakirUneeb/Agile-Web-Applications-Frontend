// Johnathan
const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticateToken');
const db = require('../../models');
const User = db.user;
const Department = db.department;
const JobRole = db.jobRole;
const SkillEnrolment = db.skillEnrolment;
const Skill = db.skill;
const SkillStrength = db.skillStrength;

router.get('/', authenticateToken, async (req, res) => {
    try {
        const manager = await User.findOne({
            where: { user_id: req.user.userId },
            include: [
                { model: Department, as: 'department' },
                { model: db.systemRole, as: 'systemRole' } //  - Jack - Include systemRole
            ]
        });
        
        if (!manager) {
            return res.status(404).send('Manager not found');
        }
        
        const teamMembers = await User.findAll({
            where: { 
                department_id: manager.department_id,
                user_id: { [db.Sequelize.Op.ne]: manager.user_id }
            },
            include: [
                { model: Department, as: 'department' },
                { model: JobRole, as: 'jobRole' }
            ]
        });
        
        res.render('manager/team', {
            user: {
                first_name: manager.first_name,
                department_id: manager.department_id,
                department_name: manager.department.department_name,
                systemRole: manager.systemRole // Pass systemRole to the view
            },
            manager: manager, // Pass the manager object as well
            teamMembers: teamMembers
        });
        
        
    } catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/member/:id', authenticateToken, async (req, res) => {
    try {
        const skills = await SkillEnrolment.findAll({
            where: { user_id: req.params.id },
            include: [
                { model: Skill, as: 'skill' },
                { model: SkillStrength, as: 'skillStrength' }
            ]
        });

        res.json(skills);
    } catch (error) {
        console.error('Error fetching member skills:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;