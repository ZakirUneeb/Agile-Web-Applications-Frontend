const express = require('express');
const router = express.Router();
const skillCategoryController = require('../../controllers/skill_category');
const db = require('../../models');

// Route to render all skill categories with the skill count
router.get('/', async (req, res) => {
    try {
        const categories = await db.skillCategory.findAll({
            include: [{
                model: db.skill,
                as: 'skills',
                attributes: ['skill_id']
            }]
        });

        const categoriesWithSkillCount = categories.map(category => ({
            skill_category_id: category.skill_category_id,
            skill_category_name: category.skill_category_name,
            skillCount: category.skills.length
        }));

        res.render('admin/all_skill_categories', { categories: categoriesWithSkillCount });
    } catch (error) {
        res.status(500).send('Error fetching skill categories.');
    }
});

// Route to add a new skill category
router.post('/add_skill_category', skillCategoryController.create);

// Route to delete a skill category
router.delete('/delete_skill_category/:skill_category_id', skillCategoryController.deleteCategory);

module.exports = router;
