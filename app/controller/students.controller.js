const db = require("../model/db.js");
let jwt = require("../service/auth.service.js");
const DbUser = db.users;
const DbStudent = db.students;
const DbLesson = db.lessons;
const studentsService = require("../service/students.service.js");
const Student = require("../model/student.js");
const { lessons } = require("../model/db.js");

exports.create = async (req, res) => {
    if (req.body.firstName && req.body.lastName && req.body.bio && req.body.level && req.body.birthdate) {
        try {
            let student = await DbStudent.create(req.body);
            return student;
        } catch (error) {
            res.status(500)
            res.json({ 'message': `there was an error ici : ${error}` });
        }
    } else {
        res.status(400);
        res.json({ 'message': 'bad query' });
    }
}

exports.getAll = async (req, res) => {
    let token = req.headers['x-access-token'];
    let verifytoken = await jwt.verifyToken(token);
    if (verifytoken) {
        try {
            let students = await DbStudent.findAll();
            if (students.length > 0) {
                students = students.map((student) => {
                    let age = studentsService.getYears(student.birthdate);
                    return new Student(
                        student.dataValues.id,
                        student.dataValues.firstName,
                        student.dataValues.lastName,
                        student.dataValues.bio,
                        student.dataValues.level,
                        student.dataValues.birthdate,
                        age
                    )
                });
                res.json(students);
            } else {
                res.status(404)
                res.json({ 'message': 'empty student list' });
            }
        } catch (error) {
            res.status(500)
            res.json({ 'message': `there was an error : ${error}` });
        }
    } else {
        res.status(401);
        res.json({ "message": " access denied " });
    }
}

exports.getById = async (req, res) => {
    let token = req.headers['x-access-token'];
    let verifytoken = await jwt.verifyToken(token);
    if (verifytoken) {
        try {
            let student = await DbStudent.findByPk(req.params.id);
            if (student) {
                let age = studentsService.getYears(student.birthdate);
                let myStudent = new Student(
                    student.dataValues.id,
                    student.dataValues.firstName,
                    student.dataValues.lastName,
                    student.dataValues.bio,
                    student.dataValues.level,
                    student.dataValues.birthdate,
                    age
                )
                res.json(myStudent);
            } else {
                res.status(404)
                res.json({ 'message': 'student not found' });
            }
        } catch (error) {
            res.status(500)
            res.json({ 'message': `there was an error : ${error}` });
        }
    } else {
        res.status(401);
        res.json({ "message": " access denied " });
    }
}

exports.enroll = async (req, res) => {
    let token = req.headers['x-access-token'];
    let verifytoken = await jwt.verifyToken(token);
    if (verifytoken) {
        try {
            let user = await DbUser.findByPk(verifytoken);
            if (user.dataValues.type == 1) {
                let student = await user.getStudent();
                if (student) {
                    let lessonEnroll = await DbLesson.findByPk(req.params.id);
                    if (lessonEnroll) {
                        await student.addLesson(lessonEnroll);
                        res.json(lessonEnroll);
                    } else {
                        res.status(404);
                        res.json({ "message": "Lesson not found" });
                    }
                } else {
                    res.status(401);
                    res.json({ "message": "You first need to create your Student profile" });
                }
            } else {
                res.status(401);
                res.json({ "message": " access only for students " });
            }
        } catch (error) {
            res.status(500)
            res.json({ 'message': `there was an error : ${error}` });
        }
    } else {
        res.status(401);
        res.json({ "message": " access denied " });
    }
}