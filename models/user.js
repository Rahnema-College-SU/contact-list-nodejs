
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        id : {
            type : Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
          type : Sequelize.STRING,
          unique: true,
        },
        password: {
          type : Sequelize.STRING,
        },
        phone: {
        type: Sequelize.STRING,
        },
    });
    return User;
  };
  