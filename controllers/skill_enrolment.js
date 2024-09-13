// Created by Zakir Uneeb
const utilities = require('../utilities/utility');
const db = require('../models');
const SkillEnrolment = db.skillEnrolment;
const User = db.user;
const Skill = db.skill;
const SkillStrength = db.skillStrength;
const SkillCategory = db.skillCategory;

const create = async (req, res) => {
    console.log("Incoming request body:", req.body);

    const { 
        user_id, 
        skill: skill_id, 
        skill_id: skillIdAlternative,
        skill_strength: skill_strength_id, 
        skill_strength_id: skillStrengthAlternative, 
        expiry_date, 
        notes 
    } = req.body;

    const finalSkillId = skill_id || skillIdAlternative;
    const finalSkillStrengthId = skill_strength_id || skillStrengthAlternative;

    if (!user_id || !finalSkillId || !finalSkillStrengthId) {
        return utilities.formatErrorResponse(res, 400, "Missing required fields");
    }

    try {
        const skillEnrolment = await SkillEnrolment.create({
            user_id: parseInt(user_id, 10),
            skill_id: parseInt(finalSkillId, 10),
            skill_strength_id: parseInt(finalSkillStrengthId, 10),
            expiry_date,
            notes
        });

        console.log("Skill enrolment created:", skillEnrolment);

        if (req.originalUrl.includes('/my_skills')) {
            return res.redirect('/my_skills');
        } else {
            return res.status(201).json(skillEnrolment);
        }

    } catch (error) {
        console.log("Error creating skill enrolment:", error.message);
        return utilities.formatErrorResponse(res, 400, error.message);
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
        console.log('Error retrieving skill enrolments:', error);
        res.status(500).send('Error retrieving skill enrolments');
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

        let user;
        if (!skillEnrolments.length) {
            user = await User.findByPk(userId, {
                attributes: ['first_name', 'last_name']
            });

            if (!user) {
                return res.status(404).send('User not found');
            }

            return res.render('admin/view_staff_skills', { skills: [], user });
        }
        user = skillEnrolments[0].user;
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

const update = async (req, res) => {
    const { skill_enrolment_id, skill_strength_id, expiry_date, notes } = req.body;

    try {
        const skillEnrolment = await SkillEnrolment.findByPk(skill_enrolment_id);
        if (!skillEnrolment) {
            throw new Error("Skill enrolment not found");
        }

        const skillEnrolmentUpdate = {
            skill_strength_id: parseInt(skill_strength_id, 10),
            expiry_date,
            notes
        };

        await SkillEnrolment.update(skillEnrolmentUpdate, {
            where: { skill_enrolment_id }
        });

        res.redirect('/my_skills');
    } catch (error) {
        console.error('Error updating skill enrolment:', error);
        utilities.formatErrorResponse(res, 400, error.message);
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
                { model: SkillStrength, as: 'skillStrength', attributes: ['skill_strength_id', 'skill_strength_name'] }
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
            skillEnrolment: skillEnrolment,
            skillStrength: skillEnrolment.skillStrength,
            skillStrengths: skillStrengths,
            expiryDate: skillEnrolment.expiry_date,
            notes: skillEnrolment.notes,
            user: req.user 
        });
    } catch (error) {
        console.error('Error fetching skill enrolment details:', error);
        res.status(500).json({ message: "Failed to fetch skill details" });
    }
};


//Jack
const getExpiringSkills = async (userId) => {
    const currentDate = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(currentDate.getMonth() + 1);

    try {
        const expiringSkills = await SkillEnrolment.findAll({
            where: {
                user_id: userId,
                expiry_date: {
                    [db.Sequelize.Op.between]: [currentDate, nextMonth]
                }
            },
            include: [
                { model: Skill, as: 'skill', attributes: ['skill_name'] }
            ]
        });
        return expiringSkills;
    } catch (error) {
        console.error('Error fetching expiring skills:', error);
        throw new Error('Error fetching expiring skills');
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
    viewSkillDetail,
    getExpiringSkills
};