module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        type: Sequelize.INTEGER,
    });
    return User;
};
