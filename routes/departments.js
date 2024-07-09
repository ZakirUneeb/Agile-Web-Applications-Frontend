const app = require('../app');
const controller = require('../controllers/departments');
const express = require('express');
const router = express.Router();

router.get('/', controller.getAll);
router.get('/name/:value', controller.getByName);
router.get('/:department_id', controller.getById);

router.post('/', controller.create);
router.delete('/',controller.deleting);
router.put('/', controller.update);


module.exports = router;