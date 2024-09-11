// Created by Zakir Uneeb
const utilities = require('../utilities/utility');
const db = require('../models');
const SkillEnrolment = db.skillEnrolment;
const User = db.user;
const Skill = db.skill;
const SkillStrength = db.skillStrength;
const SkillCategory = db.skillCategory;

// Modified by Jack for Frontendd
const create = async (req, res) => {
    const { user_id, skill: skill_id, skill_strength: skill_strength_id, expiry_date, notes } = req.body;

    if (!user_id || !skill_id || !skill_strength_id || !expiry_date) {
        return res.send('<script>alert("Form not completed. Please fill out all fields."); window.history.back();</script>');
    }

    try {
        const existingEnrolment = await SkillEnrolment.findOne({
            where: {
                user_id: parseInt(user_id, 10),
                skill_id: parseInt(skill_id, 10)
            }
        });

        if (existingEnrolment) {
            return res.send('<script>alert("Skill Already Enrolled"); window.history.back();</script>');
        }

        await SkillEnrolment.create({
            user_id: parseInt(user_id, 10),
            skill_id: parseInt(skill_id, 10),
            skill_strength_id: parseInt(skill_strength_id, 10),
            expiry_date,
            notes
        });

        res.redirect('/my_skills');
    } catch (error) {
        console.error('Error during skill enrolment creation:', error);
        res.send(`<script>alert("Error: ${error.message}"); window.history.back();</script>`);
    }
};

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

// Modidied by jack for frontend
const update = async (req, res) => {
    console.log("Incoming request: POST /my_skills/update");
    console.log("Request body:", req.body);

    const skill_enrolment_id = parseInt(req.body.skill_enrolment_id, 10);
    const user_id = parseInt(req.body.user_id, 10);
    const skill_strength_id = parseInt(req.body.skill_strength_id, 10);
    const expiry_date = req.body.expiry_date;
    const notes = req.body.notes;

    if (isNaN(skill_enrolment_id) || isNaN(user_id) || isNaN(skill_strength_id) || !expiry_date) {
        console.error("Error: Missing required fields");
        return res.status(400).send('<script>alert("Missing required fields!"); window.history.back();</script>');
    }

    try {
        const currentEnrolment = await SkillEnrolment.findByPk(skill_enrolment_id);

        if (!currentEnrolment) {
            console.error("Skill enrolment not found");
            return res.status(400).send('<script>alert("Skill enrolment not found!"); window.history.back();</script>');
        }

        const hasChanges = (
            currentEnrolment.skill_strength_id !== skill_strength_id ||
            currentEnrolment.expiry_date !== expiry_date ||
            currentEnrolment.notes !== notes
        );

        if (!hasChanges) {
            console.log("No changes detected.");
            return res.send('<script>alert("No changes made!"); window.location.href="/my_skills";</script>');
        }

        await SkillEnrolment.update({
            skill_strength_id,
            expiry_date,
            notes
        }, {
            where: { skill_enrolment_id }
        });

        console.log("Skill enrolment updated successfully.");
        return res.redirect('/my_skills');
    } catch (error) {
        console.error("Error during update:", error.message);
        return res.status(400).send(`<script>alert("Error: ${error.message}"); window.history.back();</script>`);
    }
};

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

// Modidied by jack for frontend
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

        const skillCategories = await SkillCategory.findAll({
            attributes: ['skill_category_id', 'skill_category_name']
        });

        const skillStrengths = await SkillStrength.findAll({
            attributes: ['skill_strength_id', 'skill_strength_name']
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

        res.render('common/my_skills', { 
            categorizedSkills, 
            skillCategories, 
            skillStrengths, 
            user: req.user 
        });
    } catch (error) {
        console.error('Error fetching user skills:', error);
        res.status(500).json({ message: "Failed to fetch skills" });
    }
};

const viewSkillDetail = async (req, res) => {
    const skillEnrolmentId = req.query.skill_enrolment_id;
    
    try {
        const skillEnrolment = await SkillEnrolment.findByPk(skillEnrolmentId, {
            include: [
                { model: Skill, as: 'skill', attributes: ['skill_name'] },
                { model: SkillStrength, as: 'skillStrength', attributes: ['skill_strength_name', 'skill_strength_id'] }
            ]
        });

        if (!skillEnrolment) {
            throw new Error("Skill enrolment not found");
        }

        const skillStrengths = await SkillStrength.findAll({
            attributes: ['skill_strength_id', 'skill_strength_name']
        });

        res.render('common/skill_detail', {
            skill: skillEnrolment.skill, 
            skillStrength: skillEnrolment.skillStrength,
            expiryDate: skillEnrolment.expiry_date,
            notes: skillEnrolment.notes,
            user: req.user, 
            skillEnrolmentId: skillEnrolmentId,
            skillStrengths
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