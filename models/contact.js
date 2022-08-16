
module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("Contact", {
        id : {
            type : Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        phone: {
        type: Sequelize.STRING,
        unique: true,
        },
    });
    return Contact;
  };
  