const config = require("../config/config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD, {
        host: config.HOST,
        dialect: config.dialect,
        port: config.PORT
    }
);

// Attempt to connect to the database.
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Require models
db.department = require("./department")(sequelize, Sequelize);
db.user = require("./user")(sequelize, Sequelize);
db.jobRole = require("./job_role")(sequelize, Sequelize);
db.systemRole = require("./system_role")(sequelize, Sequelize);
db.skill = require("./skill")(sequelize, Sequelize);
db.skillCategory = require("./skill_category.js")(sequelize, Sequelize);
db.skillEnrolment = require("./skill_enrolment.js")(sequelize, Sequelize);
db.skillStrength = require("./skill_strength.js")(sequelize, Sequelize);

// Set up associations
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;
