module.exports = (sequelize, Sequelize) => {
  const Department = sequelize.define(
    "department",
    {
      department_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      department_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: 'department',
    }
  );
  // Primary key functionality
  Department.associate = (models) => {
    Department.hasMany(models.User, {
      foreignKey: 'department_id',
      as: 'users',
    });
  };

  return Department;
};
