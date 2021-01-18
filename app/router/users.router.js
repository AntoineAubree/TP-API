var express = require('express');
var router = express.Router();
const usersController = require('../controller/users.controller.js');

router.post('/register', usersController.register);
router.post('/login', usersController.login);

router.post('/me', usersController.createSudentOrTeacher);
router.post('/me/modify-email', usersController.updateEmail);
router.post('/me/modify-password', usersController.updatePassword);
router.delete('/me/delete', usersController.remove);
router.put('/me/:id', usersController.updateStudentOrTeacher);
router.get('/me', usersController.getMe);

module.exports = router;
