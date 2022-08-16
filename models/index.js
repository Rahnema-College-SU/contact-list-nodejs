const dbConfig = require("../db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users    = require("./user.js")(sequelize, Sequelize);
db.contacts = require("./contact.js")(sequelize, Sequelize);
db.usercontacts = sequelize.define('User_Contact', {
  name: {
    type : Sequelize.STRING
  }
});
db.users.belongsToMany(db.contacts, { through: db.usercontacts });
db.contacts.belongsToMany(db.users, { through: db.usercontacts });
module.exports = db;
