const express = require('express');
const router = express.Router();
const controller = require('../controllers/skill_category');

router.get('/', controller.getAll);
router.get('/:skill_category_id', controller.getById);
router.get('/name/:skill_category_name', controller.getByName);
router.post('/', controller.create);
router.put('/', controller.update);
router.delete('/', controller.deleteCategory);

module.exports = router;