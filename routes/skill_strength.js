// Created by Zakir Uneeb
const express = require('express');
const router = express.Router();
const controller = require('../controllers/skill_strength.js');

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:skill_strength_id', controller.getById);
router.get('/name/:skill_strength_name', controller.getByName);
router.put('/', controller.update);
router.delete('/:skill_strength_id', controller.deleteStrength);

module.exports = router;