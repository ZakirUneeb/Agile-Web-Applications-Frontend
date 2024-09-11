// Zakir
const express = require('express');
const router = express.Router();
const { getUsersByDepartment } = require('../../controllers/departments');

router.get('/:department_id/staff', async (req, res) => {
    const departmentId = req.params.department_id;
    try {
        const department = await getUsersByDepartment(departmentId);

        if (!department || department.length === 0) {
            return res.status(404).send("Department not found.");
        }

        const users = department[0].users;
        res.render('admin/department_staff', { department: department[0], users });
    } catch (error) {
        res.status(500).send('Error fetching staff for department.');
    }
});

module.exports = router;