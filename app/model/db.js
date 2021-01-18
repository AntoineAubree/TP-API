const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const lessonsModel = require("./lessons.model.js")
const usersModel = require("./users.model.js")
const studentsModel = require("./students.model.js")
const teachersModel = require("./teachers.model.js")
const publicationsModel = require("./publications.model.js");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
});

let db = {
    sequelize: sequelize,
    Sequelize: Sequelize,
    lessons: lessonsModel(sequelize, Sequelize),
    users: usersModel(sequelize, Sequelize),
    students: studentsModel(sequelize, Sequelize),
    teachers: teachersModel(sequelize, Sequelize),
    publications: publicationsModel(sequelize, Sequelize),
}

db.users.hasOne(db.students);
db.users.hasOne(db.teachers);
db.students.belongsTo(db.users);
db.teachers.belongsTo(db.users);
db.teachers.belongsToMany(db.lessons, { through: 'LessonTeachers' });
db.lessons.belongsToMany(db.teachers, { through: 'LessonTeachers' });
db.students.belongsToMany(db.lessons, { through: 'LessonStudents' });
db.lessons.belongsToMany(db.students, { through: 'LessonStudents' });
db.users.hasOne(db.publications);
db.publications.belongsTo(db.users);
db.lessons.hasOne(db.publications);
db.publications.belongsTo(db.lessons);

module.exports = db;