var express = require('express');
var router = express.Router();
const teachersController = require('../controller/teachers.controller.js');

router.get('/', teachersController.getAll);
router.get('/:id', teachersController.getById);

module.exports = router;
