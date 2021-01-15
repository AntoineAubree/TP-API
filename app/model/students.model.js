module.exports = (sequelize, Sequelize) => {
    const Student = sequelize.define('students', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: Sequelize.STRING, 
        lastName: Sequelize.STRING,
        bio: Sequelize.STRING, 
        level: Sequelize.INTEGER,
        birthdate: Sequelize.DATE, 
    });
    return Student;
};