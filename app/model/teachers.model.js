module.exports = (sequelize, Sequelize) => {
    const Teacher = sequelize.define('teachers', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: Sequelize.STRING, 
        lastName: Sequelize.STRING,
        bio: Sequelize.STRING, 
        subject: Sequelize.STRING,
    });
    return Teacher;
};