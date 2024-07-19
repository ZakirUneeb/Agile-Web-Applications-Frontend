// Jack
const app = require('../app');
const controller = require('../controllers/user');
const express = require('express');
const router = express.Router();

// Specific Routes First
router.get('/search', controller.searchUsers);

// General Routes after
router.get('/', controller.getAll);
router.get('/:user_id', controller.getById);

router.post('/', controller.create);
router.put('/', controller.update);
router.delete('/',controller.deleting);



module.exports = router;