const express = require('express');
const router = express.Router();
const controller = require('../controllers/skill_category.js');

router.get('/', controller.getAll);
router.get('/:skill_category_id', controller.getById);
router.get('/name/:skill_category_name', controller.getByName);
router.post('/', controller.create);
router.put('/', controller.update);
router.delete('/:skill_category_id', controller.deleteCategory);

module.exports = router;