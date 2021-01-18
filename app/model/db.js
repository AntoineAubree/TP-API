const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const lessonsModel = require("./lessons.model.js")
const usersModel = require("./users.model.js")
const studentsModel = require("./students.model.js")
const teachersModel = require("./teachers.model.js")
const publicationsModel = require("./publications.model.js");
const commentsModel = require("./comments.model.js");

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
    comments: commentsModel(sequelize, Sequelize),
}

db.users.hasOne(db.students);
db.users.hasOne(db.teachers);
db.students.belongsTo(db.users);
db.teachers.belongsTo(db.users);
db.teachers.belongsToMany(db.lessons, { through: 'LessonTeachers' });
db.lessons.belongsToMany(db.teachers, { through: 'LessonTeachers' });
db.students.belongsToMany(db.lessons, { through: 'LessonStudents' });
db.lessons.belongsToMany(db.students, { through: 'LessonStudents' });
db.students.hasMany(db.publications);
db.publications.belongsTo(db.students);
db.teachers.hasMany(db.publications);
db.publications.belongsTo(db.teachers);
db.lessons.hasMany(db.publications);
db.publications.belongsTo(db.lessons);
db.students.hasMany(db.comments);
db.comments.belongsTo(db.students);
db.teachers.hasMany(db.comments);
db.comments.belongsTo(db.teachers);
db.publications.hasMany(db.comments);
db.comments.belongsTo(db.publications);
db.students.belongsToMany(db.students, { through: 'Firendship', as: 'student', foreignKey: 'studentId' });
db.students.belongsToMany(db.students, { through: 'Firendship', as: 'friend', foreignKey: 'friendId' });

module.exports = db;