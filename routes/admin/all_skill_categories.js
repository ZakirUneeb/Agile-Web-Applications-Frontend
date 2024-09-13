const express = require('express');
const router = express.Router();
const skillCategoryController = require('../../controllers/skill_category');
const skillController = require('../../controllers/skill');
const db = require('../../models');

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

router.post('/add_skill_category', skillCategoryController.create);

router.delete('/delete_skill_category/:skill_category_id', skillCategoryController.deleteCategory);

router.get('/view_skills_by_category/:skill_category_id', skillController.getByCategory);

router.post('/edit_skill_category/:skill_category_id', skillCategoryController.update);

module.exports = router;
