// Zakir
const express = require('express');
const router = express.Router();
const { getUsersByDepartment } = require('../../controllers/departments');

router.get('/', async (req, res) => {
    try {
        const departments = await getUsersByDepartment();
        
        const departmentsWithUserCount = departments.map(department => ({
            department_id: department.department_id,
            department_name: department.department_name,
            userCount: department.users.length
        }));

        res.render('admin/all_departments', { departments: departmentsWithUserCount });
    } catch (error) {
        res.status(500).send('Error fetching departments.');
    }
});

module.exports = router;
