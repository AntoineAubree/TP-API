const dataBase = require("../model/db.js");
let jwt = require("../service/auth.service.js");
const DbPublication = dataBase.publications;
const DbUser = dataBase.users;
const DbLesson = dataBase.lessons;

exports.create = async (req, res) => {
    let token = req.headers['x-access-token'];
    let verifytoken = await jwt.verifyToken(token);
    if (verifytoken) {
        try {
            let lesson = await DbLesson.findByPk(req.params.id);
            if (lesson) {
                let user = await DbUser.findByPk(verifytoken);
                if (user.dataValues.type == 1) {
                    let student = await user.getStudent();
                    if (student) {
                        if (req.body.title && req.body.bodyText) {
                            let publication = await DbPublication.create({ title: req.body.title, bodyText: req.body.bodyText, type: 1 });
                            await publication.setLesson(lesson);
                            await publication.setStudent(student);
                            res.json({ publication });
                        } else {
                            res.status(400);
                            res.json({ 'message': 'bad query' });
                        }
                    } else {
                        res.status(401);
                        res.json({ "message": "You first need to create your Student profile" });
                    }
                } else if (user.dataValues.type == 2) {
                    let teacher = await user.getTeacher();
                    if (teacher) {
                        if (req.body.title && req.body.bodyText) {
                            let publication = await DbPublication.create({ title: req.body.title, bodyText: req.body.bodyText, type: 2 });
                            await publication.setLesson(lesson);
                            await publication.setTeacher(teacher);
                            res.json({ publication });
                        } else {
                            res.status(400);
                            res.json({ 'message': 'bad query' });
                        }
                    } else {
                        res.status(401);
                        res.json({ "message": "You first need to create your Teacher profile" });
                    }
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

exports.update = async (req, res) => {
    let token = req.headers['x-access-token'];
    let verifytoken = await jwt.verifyToken(token);
    if (verifytoken) {
        try {
            let user = await DbUser.findByPk(verifytoken);
            let publication = await DbPublication.findByPk(req.params.id);
            if (publication) {
                if (publication.type == 1 && user.type == 1) {
                    let student = await user.getStudent();
                    if (student) {
                        if (student.id == publication.studentId) {
                            if (req.body.title && req.body.bodyText) {
                                let publication = await DbPublication.update({ title: req.body.title, bodyText: req.body.bodyText, type: 1 }, { where: { id: req.params.id }, });
                                res.json({ publication });
                            } else {
                                res.status(400);
                                res.json({ 'message': 'bad query' });
                            }
                        } else {
                            res.status(401);
                            res.json({ "message": " access denied " });
                        }
                    } else {
                        res.status(401);
                        res.json({ "message": "You first need to create your Student profile" });
                    }
                } else if (publication.type == 2 && user.type == 2) {
                    let teacher = await user.getTeacher();
                    if (teacher) {
                        if (teacher.id == publication.teacherId) {
                            if (req.body.title && req.body.bodyText) {
                                let publication = await DbPublication.update({ title: req.body.title, bodyText: req.body.bodyText, type: 2 }, { where: { id: req.params.id }, });
                                res.json({ publication });
                            } else {
                                res.status(400);
                                res.json({ 'message': 'bad query' });
                            }
                        } else {
                            res.status(401);
                            res.json({ "message": " access denied " });
                        }
                    } else {
                        res.status(401);
                        res.json({ "message": "You first need to create your Teacher profile" });
                    }
                } else {
                    res.status(401);
                    res.json({ "message": " access denied " });
                }
            } else {
                res.status(404);
                res.json({ "message": "Publication not found" });
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
            let user = await DbUser.findByPk(verifytoken);
            let publication = await DbPublication.findByPk(req.params.id);
            if (publication) {
                if (publication.type == 1 && user.type == 1) {
                    let student = await user.getStudent();
                    if (student) {
                        if (student.id == publication.studentId) {
                            await DbPublication.destroy({
                                where: {
                                    id: req.params.id,
                                }
                            });
                            res.json({ 'message': `deleted publication with id : ${req.params.id}` });
                        } else {
                            res.status(401);
                            res.json({ "message": " access denied " });
                        }
                    } else {
                        res.status(401);
                        res.json({ "message": "You first need to create your Student profile" });
                    }
                } else if (publication.type == 2 && user.type == 2) {
                    let teacher = await user.getTeacher();
                    if (teacher) {
                        if (teacher.id == publication.teacherId) {
                            await DbPublication.destroy({
                                where: {
                                    id: req.params.id,
                                }
                            });
                            res.json({ 'message': `deleted publication with id : ${req.params.id}` });
                        } else {
                            res.status(401);
                            res.json({ "message": " access denied " });
                        }
                    } else {
                        res.status(401);
                        res.json({ "message": "You first need to create your Teacher profile" });
                    }
                } else {
                    res.status(401);
                    res.json({ "message": " access denied " });
                }
            } else {
                res.status(404);
                res.json({ "message": "Publication not found" });
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
    let token = req.headers['x-access-token'];
    let verifytoken = await jwt.verifyToken(token);
    if (verifytoken) {
        try {
            let publications = await DbPublication.findAll();
            if (publications) {
                res.json(publications);
            } else {
                res.status(404)
                res.json({ 'message': 'empty publication list' });
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
            let publication = await DbPublication.findByPk(req.params.id);
            if (publication) {
                res.json(publication);
            } else {
                res.status(404)
                res.json({ 'message': 'Publication not found' });
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