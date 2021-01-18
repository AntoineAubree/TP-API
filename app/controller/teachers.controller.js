const db = require("../model/db.js");
const DbTeacher = db.teachers;
const jwt = require("../service/auth.service.js");
const Teacher = require("../model/teacher.js");

exports.create = async (req, res) => {
    if (req.body.firstName && req.body.lastName && req.body.bio && req.body.subject) {
        try {
            let teacher = await DbTeacher.create(req.body);
            return teacher;
        } catch (error) {
            res.status(500)
            res.json({ 'message': `there was an error : ${error}` });
            return false;
        }
    } else {
        res.status(400);
        res.json({ 'message': 'bad query' });
        return false;
    }
}

exports.update = async (req, res) => {
    if (req.body.firstName && req.body.lastName && req.body.bio && req.body.subject) {
        try {
            let teacher = await DbTeacher.update(
                req.body,
                { where: { id: req.params.id }, }
            );
            return teacher;
        } catch (error) {
            res.status(500)
            res.json({ 'message': `there was an error : ${error}` });
            return false;
        }
    } else {
        res.status(400);
        res.json({ 'message': 'bad query' });
        return false;
    }
}

exports.getAll = async (req, res) => {
    let token = req.headers['x-access-token'];
    let verifytoken = await jwt.verifyToken(token);
    if (verifytoken) {
        try {
            let teachers = await DbTeacher.findAll();
            if (teachers.length > 0) {
                teachers = teachers.map((teacher) => {
                    return new Teacher(
                        teacher.dataValues.id,
                        teacher.dataValues.firstName,
                        teacher.dataValues.lastName,
                        teacher.dataValues.bio,
                        teacher.dataValues.subject,
                    )
                });
                res.json(teachers);
            } else {
                res.status(404)
                res.json({ 'message': 'empty teacher list' });
            }
        } catch (error) {
            res.status(500)
            res.json({ 'message': `there was an error : ${error}` });
        }
    } else {
        res.status(401);
        res.json({ 'message': 'access denied' });
    }
}

exports.getById = async (req, res) => {
    let token = req.headers['x-access-token'];
    let verifytoken = await jwt.verifyToken(token);
    if (verifytoken) {
        try {
            let teacher = await DbTeacher.findByPk(req.params.id);
            if (teacher) {
                let myTeacher = new Teacher(
                    teacher.dataValues.id,
                    teacher.dataValues.firstName,
                    teacher.dataValues.lastName,
                    teacher.dataValues.bio,
                    teacher.dataValues.subject,
                )
                res.json(myTeacher);
            } else {
                res.status(404)
                res.json({ 'message': 'teacher not found' });
            }
        } catch (error) {
            res.status(500)
            res.json({ 'message': `there was an error : ${error}` });
        }
    } else {
        res.status(401);
        res.json({ 'message': 'access denied' });
    }
}
