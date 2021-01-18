const dataBase = require("../model/db.js");
let jwt = require("../service/auth.service.js");
const DbPublication = dataBase.publications;
const DbUser = dataBase.users;
const DbComment = dataBase.comments;

exports.create = async (req, res) => {
    let token = req.headers['x-access-token'];
    let verifytoken = await jwt.verifyToken(token);
    if (verifytoken) {
        try {
            let publication = await DbPublication.findByPk(req.params.id);
            if (publication) {
                let user = await DbUser.findByPk(verifytoken);
                if (user.dataValues.type == 1) {
                    let student = await user.getStudent();
                    if (student) {
                        if (req.body.bodyText) {
                            let comment = await DbComment.create({ bodyText: req.body.bodyText });
                            await comment.setPublication(publication);
                            await comment.setStudent(student);
                            res.json({ comment });
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
                        if (req.body.bodyText) {
                            let comment = await DbComment.create({ bodyText: req.body.bodyText });
                            await comment.setPublication(publication);
                            await comment.setTeacher(teacher);
                            res.json({ comment });
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
                res.json({ "message": "Pulication not found" });
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
            let comment = await DbComment.findByPk(req.params.id);
            if (comment) {
                if (user.type == 1) {
                    let student = await user.getStudent();
                    if (student) {
                        if (student.id == comment.studentId) {
                            if (req.body.bodyText) {
                                let comment = await DbComment.update({ bodyText: req.body.bodyText }, { where: { id: req.params.id }, });
                                res.json({ comment });
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
                } else if (user.type == 2) {
                    let teacher = await user.getTeacher();
                    if (teacher) {
                        if (teacher.id == comment.teacherId) {
                            if (req.body.bodyText) {
                                let comment = await DbComment.update({ bodyText: req.body.bodyText }, { where: { id: req.params.id }, });
                                res.json({ comment });
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
                }
            } else {
                res.status(404);
                res.json({ "message": "Comment not found" });
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
            let comment = await DbComment.findByPk(req.params.id);
            if (comment) {
                if (user.type == 1) {
                    let student = await user.getStudent();
                    if (student) {
                        if (student.id == comment.studentId) {
                            await DbComment.destroy({
                                where: {
                                    id: req.params.id,
                                }
                            });
                            res.json({ 'message': `deleted comment with id : ${req.params.id}` });
                        } else {
                            res.status(401);
                            res.json({ "message": " access denied " });
                        }
                    } else {
                        res.status(401);
                        res.json({ "message": "You first need to create your Student profile" });
                    }
                } else if (user.type == 2) {
                    let teacher = await user.getTeacher();
                    if (teacher) {
                        if (teacher.id == comment.teacherId) {
                            await DbComment.destroy({
                                where: {
                                    id: req.params.id,
                                }
                            });
                            res.json({ 'message': `deleted comment with id : ${req.params.id}` });
                        } else {
                            res.status(401);
                            res.json({ "message": " access denied " });
                        }
                    } else {
                        res.status(401);
                        res.json({ "message": "You first need to create your Teacher profile" });
                    }
                }
            } else {
                res.status(404);
                res.json({ "message": "Comment not found" });
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
            let comments = await DbComment.findAll();
            if (comments) {
                res.json(comments);
            } else {
                res.status(404)
                res.json({ 'message': 'empty comment list' });
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
            let comment = await DbComment.findByPk(req.params.id);
            if (comment) {
                res.json(comment);
            } else {
                res.status(404)
                res.json({ 'message': 'Comment not found' });
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