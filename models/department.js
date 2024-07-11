module.exports = (sequelize, Sequelize) => {
    const Department = sequelize.define("department", {
        department_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'department_id'
        },
        department_name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'department'
    });

    Department.associate = (models) => {
        Department.hasMany(models.user, {
            foreignKey: 'department_id',
            as: 'users'
        });
    };

    return Department;
};
