const utilities = require('../utilities/utility');
const db = require('../models');
const JobRole = db.jobRole;

const getAll = async (req, res) => {
    try {
        const jobRoles = await JobRole.findAll();
        res.status(200).json(jobRoles);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const getById = async (req, res) => {
    const id = req.params.job_role_id;
    try {
        const jobRole = await JobRole.findByPk(id);
        if (!jobRole) {
            throw new Error("Unable to find Job Role with id " + id);
        }
        res.status(200).json(jobRole);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const getByName = async (req, res) => {
    const name = req.query.job_role_name;
    try {
        if (!name) {
            throw new Error("Job role name is required");
        }
        const jobRoles = await JobRole.findAll({
            where: { job_role_name: name }
        });
        if (jobRoles.length === 0) {
            throw new Error("Unable to find Job Roles with name " + name);
        }
        res.status(200).json(jobRoles);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const create = async (req, res) => {
    const { job_role_name } = req.body;
    try {
        if (!job_role_name) {
            throw new Error("Job role name is required");
        }
        const jobRole = await JobRole.create({ job_role_name });
        res.status(201).json(jobRole);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const update = async (req, res) => {
    const { job_role_id, job_role_name } = req.body;
    try {
        if (!job_role_id || !job_role_name) {
            throw new Error("Missing essential fields");
        }
        await JobRole.update({ job_role_name }, { where: { job_role_id: job_role_id } });
        const updatedJobRole = await JobRole.findByPk(job_role_id);
        res.status(200).json(updatedJobRole);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
};

const deleteJobRole = async (req, res) => {
    const { job_role_id } = req.params;
    try {
        const deleted = await JobRole.destroy({ where: { job_role_id: job_role_id } });
        if (deleted === 0) {
            throw new Error("Job Role not found or already deleted.");
        }
        res.status(200).send("Job Role deleted successfully.");
    } catch (error) {
        utilities.formatErrorResponse(res, 404, error.message);
    }
};

module.exports = { getAll, getById, getByName, create, update, deleteJobRole };