// Johnathan
const express = require('express');
const router = express.Router();
const controller = require('../controllers/skill');

router.get('/', controller.getAll);
router.get('/:skill_id', controller.getById);
router.get('/name/:skill_name', controller.getByName);
router.get('/category/:skill_category_id', controller.getByCategory);
router.post('/', controller.create);
router.put('/', controller.update);
router.delete('/:skill_id', controller.deleteSkill);

module.exports = router;