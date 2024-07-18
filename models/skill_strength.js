// Created by Zakir Uneeb
module.exports = (sequelize, Sequelize) => {
  const SkillStrength = sequelize.define("skill_strength", {
      skill_strength_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          field: 'skill_strength_id'
      },
      skill_strength_name: {
          type: Sequelize.STRING,
          allowNull: false
      }
  }, {
      timestamps: false,
      freezeTableName: true,
      tableName: 'skill_strength'
  });

  SkillStrength.associate = (models) => {
      SkillStrength.hasMany(models.skillEnrolment, {
          foreignKey: 'skill_strength_id',
          as: 'skillEnrolments'
      });
  };

  return SkillStrength;
};