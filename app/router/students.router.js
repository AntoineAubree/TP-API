var express = require('express');
var router = express.Router();
const studentsController = require('../controller/students.controller.js');

router.get('/', studentsController.getAll);
router.get('/:id', studentsController.getById);
router.post('/enroll/:id', studentsController.enroll);

module.exports = router;
