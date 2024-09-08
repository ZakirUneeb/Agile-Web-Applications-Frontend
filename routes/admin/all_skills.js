// Zakir
const express = require('express');
const router = express.Router();
const skillController = require('../../controllers/skill');
const skillCategoryController = require('../../controllers/skill_category');

router.get('/', skillController.renderAllSkills);

module.exports = router;
