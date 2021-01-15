module.exports = (sequelize, Sequelize) => {
    const Publication = sequelize.define('publications', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: Sequelize.STRING, 
        bodyText: Sequelize.STRING,
        type: Sequelize.STRING, 
    });
    return Publication;
};