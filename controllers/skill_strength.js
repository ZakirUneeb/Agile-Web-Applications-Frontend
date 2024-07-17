const utilities = require('../utilities/utility');
const db = require('../models');
const SkillStrength = db.skillStrength;

const getAll = async (req, res) => {
    try {
        const categories = await SkillStrength.findAll();
        res.status(200).json(categories);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const getById = async (req, res) => {
    const id = req.params.skill_strength_id;
    try {
        const strength = await SkillStrength.findByPk(id);
        if (!strength) {
            throw new Error("Unable to find Skill Strength with id " + id);
        }
        res.status(200).json(strength);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const getByName = async (req, res) => {
    const name = req.params.skill_strength_name;
    try {
        const categories = await SkillStrength.findAll({
            where: { skill_strength_name: name }
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
    const { skill_strength_name } = req.body;
    try {
        if (!skill_strength_name) {
            throw new Error("Skill strength name is required");
        }
        const strength = await SkillStrength.create({ skill_strength_name });
        res.status(201).json(strength);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const update = async (req, res) => {
    const { skill_strength_id, skill_strength_name } = req.body;
    try {
        if (!skill_strength_id || !skill_strength_name) {
            throw new Error("Missing essential fields");
        }
        await SkillStrength.update({ skill_strength_name }, { where: { skill_strength_id: skill_strength_id } });
        const updatedStrength = await SkillStrength.findByPk(skill_strength_id);
        res.status(200).json(updatedStrength);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const deleteStrength = async (req, res) => {
    const skill_strength_id  = req.params.skill_strength_id;
    try {
        const deleted = await SkillStrength.destroy({ where: { skill_strength_id: skill_strength_id } });
        if (deleted === 0) {
            throw new Error("Skill Strength not found or already deleted.");
        }
        res.status(200).send("Skill Strength deleted successfully.");
    } catch (error) {
        utilities.formatErrorResponse(res, 404, error.message);
    }
};

module.exports = { getAll, getById, getByName, create, update, deleteStrength };