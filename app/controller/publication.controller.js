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
                            let publication = await DbPublication.create(req.body, { type: 1 });
                            await publication.setLesson(lesson);
                            await publication.setUser(user);
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
                            let publication = await DbPublication.create(req.body, { type: 2 });
                            await publication.setLesson(lesson);
                            await publication.setUser(user);
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