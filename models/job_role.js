// Created by Zakir Uneeb
module.exports = (sequelize, Sequelize) => {
  const JobRole = sequelize.define("job_role", {
      job_role_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      job_role_name: {
          type: Sequelize.STRING,
          allowNull: false
      }
  }, {
      timestamps: false,
      freezeTableName: true,
      tableName: 'job_role'
  });

  JobRole.associate = (models) => {
      JobRole.hasMany(models.user, {
          foreignKey: 'job_role_id',
          as: 'users'
      });
  };

  return JobRole;
};
