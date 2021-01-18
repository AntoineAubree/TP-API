var express = require('express');
var router = express.Router();
const commentsController = require('../controller/comments.controller.js');

router.post('/publication/:id', commentsController.create);
router.put('/:id', commentsController.update);
router.delete('/:id', commentsController.remove);
router.get('/:id', commentsController.getById);
router.get('/', commentsController.getAll);

module.exports = router;
