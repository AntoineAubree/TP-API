const express = require("express");
const bodyParser = require("body-parser");
const port = 8080;
const routerLesson = require("./app/router/lessons.router.js");
const routerUser = require("./app/router/users.router.js");
const routerStudent = require("./app/router/students.router.js");
const routerTeacher = require("./app/router/teachers.router.js");
const routerPublication = require("./app/router/publications.router.js");
const db = require("./app/model/db.js")

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/lessons", routerLesson);
app.use("/users", routerUser);
app.use("/students", routerStudent);
app.use("/teachers", routerTeacher);
app.use("/publications", routerPublication);

db.sequelize.sync();

app.listen(port, function () {
    console.log(`Serveur démarré sur le port ${port}`);
});