// Jack
const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');

router.get('/search', controller.searchUsers);

router.get('/', controller.getAll);
router.get('/:user_id', controller.getById);

router.post('/', controller.create);
router.put('/', controller.update);
router.delete('/',controller.deleting);



module.exports = router;