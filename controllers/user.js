// Jack
const router = require('../routes/user');
const utilities = require('../utilities/utility');
const db = require('../models');
const User = db.user;
const Department = db.department;
const JobRole = db.jobRole;
const SystemRole = db.systemRole;

getAll = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [
                { model: Department, as: 'department', attributes: ['department_name'] },
                { model: JobRole, as: 'jobRole', attributes: ['job_role_name'] },
                { model: SystemRole, as: 'systemRole', attributes: ['system_role_name'] }
            ]
        });

        const transformedUsers = users.map(user => ({
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            department_id: user.department_id,
            email: user.email,
            password: user.password,
            job_role_id: user.job_role_id,
            system_role_id: user.system_role_id,
            date_joined: user.date_joined,
            department_name: user.department.department_name,
            job_role_name: user.jobRole.job_role_name,
            system_role_name: user.systemRole.system_role_name
        }));

        res.status(200).json(transformedUsers);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
}

getById = async (req, res) => {
    const id = req.params.user_id;
    try {
        const user = await User.findByPk(id, {
            include: [
                { model: Department, as: 'department', attributes: ['department_name'] },
                { model: JobRole, as: 'jobRole', attributes: ['job_role_name'] },
                { model: SystemRole, as: 'systemRole', attributes: ['system_role_name'] }
            ]
        });

        if (user == null) {
            throw new Error("Unable to find User with id " + id);
        }

        const transformedUser = {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            department_id: user.department_id,
            email: user.email,
            password: user.password,
            job_role_id: user.job_role_id,
            system_role_id: user.system_role_id,
            date_joined: user.date_joined,
            department_name: user.department.department_name,
            job_role_name: user.jobRole.job_role_name,
            system_role_name: user.systemRole.system_role_name
        };

        res.status(200).json(transformedUser);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
}

searchUsers = async (req, res) => {
    const { first_name, last_name, email, job_role_id, department_id, system_role_id, date_joined } = req.query;
    const conditions = {};

    if (first_name) conditions.first_name = first_name;
    if (last_name) conditions.last_name = last_name;
    if (email) conditions.email = email;

    if (job_role_id) conditions.job_role_id = job_role_id;
    if (department_id) conditions.department_id = department_id;
    if (system_role_id) conditions.system_role_id = system_role_id;

    if (date_joined) conditions.date_joined = date_joined;

    try {
        const users = await User.findAll({
            where: conditions,
            include: [
                { model: Department, as: 'department', attributes: ['department_name'] },
                { model: JobRole, as: 'jobRole', attributes: ['job_role_name'] },
                { model: SystemRole, as: 'systemRole', attributes: ['system_role_name'] }
            ]
        });

        if (users.length === 0) {
            return res.status(404).json({ error: { status: 404, message: "No users found matching the criteria." }});
        }

        const transformedUsers = users.map(user => ({
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            department_id: user.department_id,
            email: user.email,
            password: user.password,
            job_role_id: user.job_role_id,
            system_role_id: user.system_role_id,
            date_joined: user.date_joined,
            department_name: user.department.department_name,
            job_role_name: user.jobRole.job_role_name,
            system_role_name: user.systemRole.system_role_name
        }));

        res.status(200).json(transformedUsers);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
}

const bcrypt = require('bcrypt');

create = async (req, res) => {
    const { first_name, last_name, department_id, email, password, job_role_id, system_role_id } = req.body;

    if (!first_name || !last_name || !department_id || !email || !password || !job_role_id || !system_role_id) {
        return utilities.formatErrorResponse(res, 400, "All fields are required.");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            department_id,
            email,
            password: hashedPassword,
            job_role_id,
            system_role_id,
            date_joined: new Date() 
        });

        res.status(201).json(user);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
}

update = async (req, res) => {
    const id = req.body.user_id;

    const userUpdates = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        department_id: req.body.department_id,
        email: req.body.email,
        job_role_id: req.body.job_role_id,
        system_role_id: req.body.system_role_id,
        date_joined: req.body.date_joined
    };

    try {
        if (
            !id ||
            !userUpdates.first_name ||
            !userUpdates.last_name ||
            !userUpdates.department_id ||
            !userUpdates.email ||
            !userUpdates.job_role_id ||
            !userUpdates.system_role_id ||
            !userUpdates.date_joined
        ) {
            throw new Error("Missing essential fields");
        }

        if (req.body.password) {
            userUpdates.password = await bcrypt.hash(req.body.password, 10);
        }

        await User.update(userUpdates, {
            where: { user_id: id }
        });

        res.status(200).json(userUpdates);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
}

deleting = async (req, res) => {
    const id = req.body.user_id;

    try {
        if (!id) {
            throw new Error("Missing user ID");
        }

        const deleted = await User.destroy({
            where: { user_id: id }
        });

        if (deleted === 0) {
            throw new Error("User not found or already deleted");
        }

        res.status(200).send("User deleted successfully");
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error.message);
    }
}

module.exports = { getAll, getById, searchUsers, create, update, deleting };