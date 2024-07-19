// Johnathan
const express = require('express');
const router = express.Router();
const controller = require('../controllers/system_role');

router.get('/', controller.getAll);
router.get('/:system_role_id', controller.getById);
router.get('/name/:system_role_name', controller.getByName);
router.post('/', controller.create);
router.put('/', controller.update);
router.delete('/:system_role_id', controller.deleteSystemRole);

module.exports = router;