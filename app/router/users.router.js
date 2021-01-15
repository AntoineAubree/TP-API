var express = require('express');
var router = express.Router();
const usersController = require('../controller/users.controller.js');

router.post('/login', usersController.login);
router.post('/register', usersController.register);
router.post('/me/modify-email', usersController.updateEmail);
router.delete('/me/delete', usersController.remove);
router.post('/me', usersController.createSudentOrTeacher);

module.exports = router;
