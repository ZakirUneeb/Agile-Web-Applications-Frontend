// Created by Zakir Uneeb
const utilities = require('../utilities/utility');
const db = require('../models');
const SkillEnrolment = db.skillEnrolment;
const User = db.user;
const Skill = db.skill;
const SkillStrength = db.skillStrength;
const SkillCategory = db.skillCategory;

// Create a new skill enrolment
const create = async (req, res) => {
    const { user_id, skill_id, skill_strength_id, expiry_date, notes } = req.body;

    if (!user_id || !skill_id || !skill_strength_id) {
        return utilities.formatErrorResponse(res, 400, "Missing fields required");
    }

    try {
        const skillEnrolment = await SkillEnrolment.create({
            user_id: parseInt(user_id, 10),
            skill_id: parseInt(skill_id, 10),
            skill_strength_id: parseInt(skill_strength_id, 10),
            expiry_date,
            notes
        });

        res.status(201).json(skillEnrolment);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

// Get all skill enrolments (for employees)
const getAll = async (req, res) => {
    try {
        const skillEnrolments = await SkillEnrolment.findAll({
            include: [
                { model: User, as: 'user', attributes: ['first_name', 'last_name'] },
                { model: Skill, as: 'skill', attributes: ['skill_id', 'skill_name'] },
                { model: SkillStrength, as: 'skillStrength', attributes: ['skill_strength_id', 'skill_strength_name'] }
            ]
        });
        res.render('employee_report', { skillEnrolments: skillEnrolments });
    } catch (error) {
        console.log('Error retrieving skill enrollments:', error);
        res.status(500).send('Error retrieving skill enrollments');
    }
};

// Get skill enrolment by ID
const getById = async (req, res) => {
    const id = req.params.skill_enrolment_id;
    try {
        const skillEnrolment = await SkillEnrolment.findByPk(id, {
            include: [
                { model: User, as: 'user', attributes: ['user_id'] },
                { model: Skill, as: 'skill', attributes: ['skill_id', 'skill_name'] },
                { model: SkillStrength, as: 'skillStrength', attributes: ['skill_strength_id', 'skill_strength_name'] }
            ]
        });

        if (!skillEnrolment) {
            throw new Error("Unable to find skill enrolment with id " + id);
        }

        res.status(200).json(skillEnrolment);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

// Get skills by user ID and render them for admin view
const renderSkillsByUserId = async (req, res) => {
    const userId = req.params.user_id;

    try {
        const skillEnrolments = await SkillEnrolment.findAll({
            where: { user_id: userId },
            include: [
                { model: User, as: 'user', attributes: ['first_name', 'last_name'] },
                { model: Skill, as: 'skill', attributes: ['skill_name'] },
                { model: SkillStrength, as: 'skillStrength', attributes: ['skill_strength_name'] }
            ]
        });

        if (!skillEnrolments.length) {
            return res.status(404).render('admin/view_staff_skills', { skills: [], user: null });
        }

        const user = skillEnrolments[0].user;
        res.render('admin/view_staff_skills', { skills: skillEnrolments, user });
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).send('Internal server error');
    }
};

// Get skill enrolments by strength ID
const getByStrengthId = async (req, res) => {
    const skillStrengthId = req.params.skill_strength_id;
    try {
        const skillEnrolments = await SkillEnrolment.findAll({
            where: { skill_strength_id: skillStrengthId },
            include: [
                { model: User, as: 'user', attributes: ['user_id'] },
                { model: Skill, as: 'skill', attributes: ['skill_id', 'skill_name'] },
                { model: SkillStrength, as: 'skillStrength', attributes: ['skill_strength_id'] }
            ]
        });

        if (!skillEnrolments.length) {
            throw new Error("No skill enrolments found for skill strength id " + skillStrengthId);
        }

        res.status(200).json(skillEnrolments);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

// Get skill enrolments by user ID
const getByUserId = async (req, res) => {
    const userId = req.params.user_id;
    try {
        const skillEnrolments = await SkillEnrolment.findAll({
            where: { user_id: userId },
            include: [
                { model: User, as: 'user', attributes: ['user_id'] },
                { model: Skill, as: 'skill', attributes: ['skill_id', 'skill_name'] },
                { model: SkillStrength, as: 'skillStrength', attributes: ['skill_strength_id', 'skill_strength_name'] }
            ]
        });

        if (!skillEnrolments.length) {
            throw new Error("No skill enrolments found for user id " + userId);
        }

        res.status(200).json(skillEnrolments);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

// Update skill enrolment by ID
const update = async (req, res) => {
    const id = parseInt(req.body.skill_enrolment_id, 10);

    if (isNaN(id)) {
        return utilities.formatErrorResponse(res, 400, "Invalid skill_enrolment_id");
    }

    const skillEnrolmentUpdate = {
        user_id: parseInt(req.body.user_id, 10),
        skill_id: parseInt(req.body.skill_id, 10),
        skill_strength_id: parseInt(req.body.skill_strength_id, 10),
        expiry_date: req.body.expiry_date,
        notes: req.body.notes
    };

    try {
        if (
            isNaN(skillEnrolmentUpdate.user_id) ||
            isNaN(skillEnrolmentUpdate.skill_id) ||
            isNaN(skillEnrolmentUpdate.skill_strength_id)
        ) {
            throw new Error("Missing required fields");
        }

        const [updated] = await SkillEnrolment.update(skillEnrolmentUpdate, {
            where: { skill_enrolment_id: id }
        });

        if (updated) {
            const updatedSkillEnrolment = await SkillEnrolment.findByPk(id);
            res.status(200).json(updatedSkillEnrolment);
        } else {
            throw new Error("Skill Enrolment not found");
        }
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

// Delete skill enrolment by ID
const deleteEnrolment = async (req, res) => {
    const id = req.params.skill_enrolment_id;

    try {
        if (!id) {
            throw new Error("Missing Skill Enrolment ID");
        }

        const deleted = await SkillEnrolment.destroy({
            where: { skill_enrolment_id: id }
        });

        if (deleted === 0) {
            throw new Error("Skill Enrolment not found");
        }

        res.status(200).json({ message: "Skill Enrolment deleted successfully" });
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

// Get skills for the logged-in user
const getUserSkills = async (req, res) => {
    const userId = req.user.userId; 
  
    try {
        const skillEnrollments = await SkillEnrolment.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Skill,
                    as: 'skill',
                    attributes: ['skill_name'],
                    include: [
                        { model: SkillCategory, as: 'skillCategory', attributes: ['skill_category_name'] }
                    ]
                },
                { model: SkillStrength, as: 'skillStrength', attributes: ['skill_strength_name'] } 
            ]
        });
    
        const categorizedSkills = {};
        skillEnrollments.forEach(enrollment => {
            const category = enrollment.skill.skillCategory.skill_category_name;
            if (!categorizedSkills[category]) {
                categorizedSkills[category] = [];
            }
            categorizedSkills[category].push({
                skill_enrolment_id: enrollment.skill_enrolment_id,
                skill: enrollment.skill,
                skill_strength: enrollment.skillStrength ? enrollment.skillStrength.skill_strength_name : "Not available",
                expiry_date: enrollment.expiry_date,
                notes: enrollment.notes
            });
        });
    
        res.render('common/my_skills', { categorizedSkills, user: req.user });
    } catch (error) {
        console.error('Error fetching user skills:', error);
        res.status(500).json({ message: "Failed to fetch skills" });
    }
};

// View skill enrolment detail
const viewSkillDetail = async (req, res) => {
    const skillEnrolmentId = req.query.skill_enrolment_id;
    
    try {
        const skillEnrolment = await SkillEnrolment.findByPk(skillEnrolmentId, {
            include: [
                { model: Skill, as: 'skill', attributes: ['skill_name'] },
                { model: SkillStrength, as: 'skillStrength', attributes: ['skill_strength_name'] }
            ]
        });

        if (!skillEnrolment) {
            throw new Error("Skill enrolment not found");
        }

        res.render('common/skill_detail', {
            skill: skillEnrolment.skill, 
            skillStrength: skillEnrolment.skillStrength,
            expiryDate: skillEnrolment.expiry_date,
            notes: skillEnrolment.notes,
            user: req.user 
        });
    } catch (error) {
        console.error('Error fetching skill enrolment details:', error);
        res.status(500).json({ message: "Failed to fetch skill details" });
    }
};

module.exports = {
    create,
    getAll,
    getById,
    getByUserId,
    renderSkillsByUserId,
    getByStrengthId,
    update,
    deleteEnrolment,
    getUserSkills,
    viewSkillDetail
};
//conflict error