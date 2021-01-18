let db = require("../model/db.js");
let jwt = require("../service/auth.service.js");
let studentController = require("../controller/students.controller.js");
let teacherController = require("../controller/teachers.controller.js");
let DbUser = db.users;

exports.login = async (req, res) => {
    if (req.body.email && req.body.password) {
        try {
            const user = await DbUser.findOne({ where: { email: req.body.email } });
            if (user) {
                if (req.body.password === user.dataValues.password) {
                    let token = jwt.signToken(user.dataValues.id);
                    if (user.type === 1) {
                        let student = await user.getStudent();
                        res.json({
                            user: user,
                            student: student,
                            token: token,
                        });
                    } else if (user.type === 2) {
                        let teacher = await user.getTeacher();
                        res.json({
                            user: user,
                            teacher: teacher,
                            token: token,
                        });
                    }
                } else {
                    res.status(401);
                    res.json({ "message": "wrong password" });
                }
            } else {
                res.status(404);
                res.json({ "message": "email not found" });
            }
        } catch (error) {
            res.status(500);
            res.json({ 'message': `there was an error : ${error}` });
        }
    } else {
        res.status(400);
        res.json({ 'message': 'bad query' });
    }
}

exports.register = async (req, res) => {
    if (req.body.email && req.body.password && req.body.type) {
        try {
            const userExist = await DbUser.findOne({ where: { email: req.body.email } });
            if (!userExist) {
                let user = await DbUser.create(req.body);
                res.json(user);
            } else {
                res.status(409);
                res.json({ "message": 'email not available' });
            }
        } catch (error) {
            res.status(500);
            res.json({ 'message': `there was an error : ${error}` });
        }
    } else {
        res.status(400);
        res.json({ 'message': 'bad query' });
    }
}

exports.updateEmail = async (req, res) => {
    let token = req.headers['x-access-token'];
    let verifytoken = await jwt.verifyToken(token);
    if (verifytoken) {
        try {
            let user = await DbUser.findByPk(verifytoken);
            if (user) {
                if (req.body.email) {
                    const userExist = await DbUser.findOne({ where: { email: req.body.email } });
                    if (!userExist) {
                        user = await DbUser.update(
                            req.body,
                            { where: { id: verifytoken }, }
                        );
                        res.json({ id: verifytoken, ...req.body });
                    } else {
                        res.status(409);
                        res.json({ "message": 'email not available' });
                    }
                } else {
                    res.status(400);
                    res.json({ 'message': 'bad query' });
                }
            } else {
                res.status(404);
                res.json({ 'message': 'user not found' });
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

exports.remove = async (req, res) => {
    let token = req.headers['x-access-token'];
    let verifytoken = await jwt.verifyToken(token);
    if (verifytoken) {
        try {
            let user = await DbUser.destroy({
                where: {
                    id: verifytoken,
                }
            });
            if (user) {
                res.json({ 'message': `deleted user with id : ${verifytoken}` });
            } else {
                res.status(404)
                res.json({ 'message': 'user not found' });
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

exports.createSudentOrTeacher = async (req, res) => {
    let token = req.headers['x-access-token'];
    let verifytoken = await jwt.verifyToken(token);
    if (verifytoken) {
        try {
            let user = await DbUser.findByPk(verifytoken);
            // user.type === 1 if user is student
            if (user.type === 1) {
                let student = await user.getStudent();
                if (student) {
                    res.json({
                        'message': 'student already exist',
                        user: user,
                        student: student,
                        token: token,
                    });
                } else {
                    student = await studentController.create(req, res);
                    if (student) {
                        await user.setStudent(student);
                        res.json({
                            user: user,
                            student: student,
                            token: token,
                        });
                    }
                }
            }
            // user.type === 2 if user is teacher
            else if (user.type === 2) {
                let teacher = await user.getTeacher();
                if (teacher) {
                    res.json({
                        'message': 'teacher already exist',
                        user: user,
                        student: student,
                        token: token,
                    });
                } else {
                    teacher = await teacherController.create(req, res);
                    if (teacher) {
                        await user.setTeacher(teacher);
                        res.json({
                            user: user,
                            teacher: teacher,
                            token: token,
                        });
                    }
                }
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
