const dataBase = require("../model/db.js");
let jwt = require("../service/auth.service.js");
const DbLesson = dataBase.lessons;
const DbUser = dataBase.users;
const lessonsService = require("../service/lessons.service.js");

exports.create = async (req, res) => {
    let token = req.headers['x-access-token'];
    let verifytoken = await jwt.verifyToken(token);
    if (verifytoken) {
        try {
            let user = await DbUser.findByPk(verifytoken);
            if (user.dataValues.type == 2) {
                let teacher = await user.getTeacher();
                if (teacher) {
                    if (req.body.title && req.body.hours && req.body.description && req.body.fileName && req.body.startingDate && req.body.endingDate) {
                        let lesson = await DbLesson.create(req.body);
                        await teacher.addLesson(lesson);
                        res.json({ lesson });
                    } else {
                        res.status(400);
                        res.json({ 'message': 'bad query' });
                    }
                } else {
                    res.status(401);
                    res.json({ "message": "You first need to create your Teacher profile" });
                }
            } else {
                res.status(401);
                res.json({ "message": " access only for teachers " });
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

exports.getAll = async (req, res) => {
    try {
        let lessons = await DbLesson.findAll();
        if (lessons) {
            lessons = lessons.map(
                lesson => lessonsService.checkFinished(lesson)
            );
            res.json(lessons);
        } else {
            res.status(404)
            res.json({ 'message': 'empty lesson list' });
        }
    } catch (error) {
        res.status(500)
        res.json({ 'message': `there was an error : ${error}` });
    }
}

exports.update = async (req, res) => {
    let token = req.headers['x-access-token'];
    let verifytoken = await jwt.verifyToken(token);
    if (verifytoken) {
        try {
            let lesson = await DbLesson.findByPk(req.params.id);
            if (lesson) {
                let teachers = await lesson.getTeachers();
                let ifTeacher = false;
                for (const teacher of teachers) {
                    if (teacher.id == verifytoken) {
                        ifTeacher = true;
                        break;
                    }
                }
                if (ifTeacher) {
                    if (req.body.title && req.body.hours && req.body.description && req.body.fileName && req.body.startingDate && req.body.endingDate) {
                        await DbLesson.update(
                            req.body,
                            { where: { id: req.params.id }, }
                        );
                        res.json({ id: req.params.id, ...req.body });
                    } else {
                        res.status(400);
                        res.json({ 'message': 'bad query' });
                    }
                } else {
                    res.status(401);
                    res.json({ "message": " access denied" });
                }
            } else {
                res.status(404);
                res.json({ "message": "Lesson not found" });
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
            let lesson = await DbLesson.findByPk(req.params.id);
            if (lesson) {
                let teachers = await lesson.getTeachers();
                let ifTeacher = false;
                for (const teacher of teachers) {
                    if (teacher.id == verifytoken) {
                        ifTeacher = true;
                        break;
                    }
                }
                if (ifTeacher) {
                    await DbLesson.destroy({
                        where: {
                            id: req.params.id,
                        }
                    });
                    res.json({ 'message': `deleted lesson with id : ${req.params.id}` });
                } else {
                    res.status(401);
                    res.json({ "message": " access denied" });
                }
            } else {
                res.status(404);
                res.json({ "message": "Lesson not found" });
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
