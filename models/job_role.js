module.exports = (sequelize, Sequelize) => {
  const JobRole = sequelize.define(
    "job role",
    {
      job_role_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      job_role_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: 'job_role',
    }
  );
  // Primary key functionality
  JobRole.associate = (models) => {
    JobRole.hasMany(models.User, {
      foreignKey: 'job_role_id',
      as: 'users',
    });
  };

  return JobRole;
};
