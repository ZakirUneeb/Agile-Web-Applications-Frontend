// Jack & Zakir
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        user_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'user_id'
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        department_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        job_role_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        system_role_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        date_joined: {
            type: Sequelize.DATEONLY,
            defaultValue: Sequelize.NOW
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'user'
    });

    User.associate = (models) => {
        User.belongsTo(models.department, {
            foreignKey: 'department_id',
            as: 'department'
        });
        User.belongsTo(models.jobRole, {
            foreignKey: 'job_role_id',
            as: 'jobRole'
        });
        User.belongsTo(models.systemRole, {
            foreignKey: 'system_role_id',
            as: 'systemRole'
        });

        // Zakir - Added cascade deletion for skill enrolments upon deleting a user
        User.hasMany(models.skillEnrolment, {
            foreignKey: 'user_id',
            as: 'skillEnrolments',
            onDelete: 'CASCADE',
            hooks: true
        });
    };

    return User;
};