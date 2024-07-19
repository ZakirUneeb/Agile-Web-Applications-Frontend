// Johnathan
const utilities = require('../utilities/utility');
const db = require('../models');
const SkillCategory = db.skillCategory;

const getAll = async (req, res) => {
    try {
        const categories = await SkillCategory.findAll();
        res.status(200).json(categories);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const getById = async (req, res) => {
    const id = req.params.skill_category_id;
    try {
        const category = await SkillCategory.findByPk(id);
        if (!category) {
            throw new Error("Unable to find Skill Category with id " + id);
        }
        res.status(200).json(category);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const getByName = async (req, res) => {
    const name = req.params.skill_category_name;
    try {
        const categories = await SkillCategory.findAll({
            where: { skill_category_name: name }
        });
        if (categories.length === 0) {
            throw new Error("Unable to find Skill Categories with name " + name);
        }
        res.status(200).json(categories);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const create = async (req, res) => {
    const { skill_category_name } = req.body;
    try {
        if (!skill_category_name) {
            throw new Error("Skill category name is required");
        }
        const category = await SkillCategory.create({ skill_category_name });
        res.status(201).json(category);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const update = async (req, res) => {
    const { skill_category_id, skill_category_name } = req.body;
    try {
        if (!skill_category_id || !skill_category_name) {
            throw new Error("Missing essential fields");
        }
        await SkillCategory.update({ skill_category_name }, { where: { skill_category_id: skill_category_id } });
        const updatedCategory = await SkillCategory.findByPk(skill_category_id);
        res.status(200).json(updatedCategory);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const deleteCategory = async (req, res) => {
    const skill_category_id  = req.params.skill_category_id;
    try {
        const deleted = await SkillCategory.destroy({ where: { skill_category_id: skill_category_id } });
        if (deleted === 0) {
            throw new Error("Skill Category not found or already deleted.");
        }
        res.status(200).send("Skill Category deleted successfully.");
    } catch (error) {
        utilities.formatErrorResponse(res, 404, error.message);
    }
};

module.exports = { getAll, getById, getByName, create, update, deleteCategory };