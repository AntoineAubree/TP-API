var express = require('express');
var router = express.Router();
const usersController = require('../controller/users.controller.js');

router.post('/register', usersController.register);
router.post('/login', usersController.login);

router.put('/me/modify-email', usersController.updateEmail);
router.put('/me/modify-password', usersController.updatePassword);
router.delete('/me/delete', usersController.remove);
router.get('/me', usersController.getMe);

router.post('/me', usersController.createSudentOrTeacher);
router.put('/me/:id', usersController.updateStudentOrTeacher);

module.exports = router;
