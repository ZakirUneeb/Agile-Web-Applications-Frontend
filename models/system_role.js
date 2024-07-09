module.exports = (sequelize, Sequelize) => {
    const SystemRole = sequelize.define("system_role", {
        system_role_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        system_role_name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'system_role'
    });

    SystemRole.associate = (models) => {
        SystemRole.hasMany(models.user, {
            foreignKey: 'system_role_id',
            as: 'users'
        });
    };

    return SystemRole;
};
