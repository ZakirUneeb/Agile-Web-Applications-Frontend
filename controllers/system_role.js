// Johnathan
const utilities = require('../utilities/utility');
const db = require('../models');
const SystemRole = db.systemRole;

const getAll = async (req, res) => {
    try {
        const systemRoles = await SystemRole.findAll();
        res.status(200).json(systemRoles);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const getById = async (req, res) => {
    const id = req.params.system_role_id;
    try {
        const systemRole = await SystemRole.findByPk(id);
        if (!systemRole) {
            throw new Error("Unable to find System Role with id " + id);
        }
        res.status(200).json(systemRole);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const getByName = async (req, res) => {
    const name = req.params.system_role_name;
    try {
        const systemRoles = await SystemRole.findAll({
            where: { system_role_name: name }
        });
        if (systemRoles.length === 0) {
            throw new Error("Unable to find System Roles with name " + name);
        }
        res.status(200).json(systemRoles);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const create = async (req, res) => {
    const { system_role_name } = req.body;
    try {
        if (!system_role_name) {
            throw new Error("System role name is required");
        }
        const systemRole = await SystemRole.create({ system_role_name });
        res.status(201).json(systemRole);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const update = async (req, res) => {
    const { system_role_id, system_role_name } = req.body;
    try {
        if (!system_role_id || !system_role_name) {
            throw new Error("Missing essential fields");
        }
        await SystemRole.update({ system_role_name }, { where: { system_role_id: system_role_id } });
        const updatedSystemRole = await SystemRole.findByPk(system_role_id);
        res.status(200).json(updatedSystemRole);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const deleteSystemRole = async (req, res) => {
    const { system_role_id } = req.params;
    try {
        const deleted = await SystemRole.destroy({ where: { system_role_id: system_role_id } });
        if (deleted === 0) {
            throw new Error("System Role not found or already deleted.");
        }
        res.status(200).send("System Role deleted successfully.");
    } catch (error) {
        utilities.formatErrorResponse(res, 404, error.message);
    }
};

module.exports = { getAll, getById, getByName, create, update, deleteSystemRole };