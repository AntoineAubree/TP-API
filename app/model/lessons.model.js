module.exports = (sequelize, Sequelize) => {
    const Lesson = sequelize.define('lessons', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: Sequelize.STRING, 
        hours: Sequelize.INTEGER,
        description: Sequelize.STRING, 
        fileName: Sequelize.STRING, 
        startingDate: Sequelize.DATE,
        endingDate: Sequelize.DATE, 
    });
    return Lesson;
};