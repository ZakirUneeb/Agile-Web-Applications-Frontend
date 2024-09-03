const express = require('express');
const router = express.Router();
const db = require('../../models');
const User = db.user;
const Department = db.department;
const JobRole = db.jobRole;

const ITEMS_PER_PAGE = 10;

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Get the page number from the query, default to 1 if not provided
    const offset = (page - 1) * ITEMS_PER_PAGE;

    try {
        // Get the total number of users
        const totalUsers = await User.count();

        // Fetch users for the current page
        const staffMembers = await User.findAll({
            include: [
                { model: Department, as: 'department' },
                { model: JobRole, as: 'jobRole' }
            ],
            limit: ITEMS_PER_PAGE,
            offset: offset
        });

        const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

        // Render the 'all_staff' EJS template with pagination data
        res.render('admin/all_staff', {
            staffMembers,
            currentPage: page,      // Passing the current page
            totalPages              // Passing the total number of pages
        });
    } catch (error) {
        console.error('Error fetching staff members:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
