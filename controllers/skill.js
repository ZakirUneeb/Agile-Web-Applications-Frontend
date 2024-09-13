// Johnathan & Zakir
const utilities = require('../utilities/utility');
const db = require('../models');
const Skill = db.skill;
const SkillCategory = db.skillCategory;

const getAll = async (req, res) => {
    try {
        const skills = await Skill.findAll({
            include: [{ model: SkillCategory, as: 'skillCategory', attributes: ['skill_category_name'] }]
        });
        res.status(200).json(skills);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

// Zakir
const renderAllSkills = async (req, res) => {
    try {
        const skills = await Skill.findAll({
            include: [{ model: SkillCategory, as: 'skillCategory', attributes: ['skill_category_name'] }]
        });
        res.render('admin/all_skills', { skills });
    } catch (error) {
        res.status(400).send('Error loading skills');
    }
};

const getById = async (req, res) => {
    const id = req.params.skill_id;
    try {
        const skill = await Skill.findByPk(id, {
            include: [{ model: SkillCategory, as: 'skillCategory', attributes: ['skill_category_name'] }]
        });
        if (!skill) {
            throw new Error("Unable to find Skill with id " + id);
        }
        res.status(200).json(skill);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const getByName = async (req, res) => {
    const name = req.params.skill_name;
    try {
        const skills = await Skill.findAll({
            where: { skill_name: name },
            include: [{ model: SkillCategory, as: 'skillCategory', attributes: ['skill_category_name'] }]
        });
        if (skills.length === 0) {
            throw new Error("Unable to find Skills with name " + name);
        }
        res.status(200).json(skills);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const getByCategory = async (req, res) => {
    const categoryId = req.params.skill_category_id;
    try {
        const skills = await Skill.findAll({
            where: { skill_category_id: categoryId },
            include: [{ model: SkillCategory, as: 'skillCategory', attributes: ['skill_category_name'] }]
        });

        if (skills.length === 0) {
            return res.status(404).send('No skills found for this category.');
        }

        const category = await SkillCategory.findByPk(categoryId);

        res.render('admin/view_skills_by_category', {
            skills: skills,
            category: category
        });
    } catch (error) {
        res.status(400).send('Error loading skills by category');
    }
};

const create = async (req, res) => {
    const { skill_name, skill_category_id } = req.body;
    try {
        if (!skill_name || !skill_category_id) {
            throw new Error("Essential fields missing");
        }
        const skill = await Skill.create({ skill_name, skill_category_id });
        res.status(201).json(skill);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const update = async (req, res) => {
    const { skill_id, skill_name, skill_category_id } = req.body;
    try {
        if (!skill_id || !skill_name || !skill_category_id) {
            throw new Error("Missing essential fields");
        }
        await Skill.update({ skill_name, skill_category_id }, { where: { skill_id: skill_id } });
        const updatedSkill = await Skill.findByPk(skill_id);
        res.status(200).json(updatedSkill);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const deleteSkill = async (req, res) => {
    const skill_id = req.params.skill_id;
    try {
        const deleted = await Skill.destroy({ where: { skill_id: skill_id } });
        if (deleted === 0) {
            throw new Error("Skill not found or already deleted.");
        }
        res.status(200).send("Skill deleted successfully.");
    } catch (error) {
        utilities.formatErrorResponse(res, 404, error.message);
    }
};

module.exports = { getAll, renderAllSkills, getById, getByName, getByCategory, create, update, deleteSkill };