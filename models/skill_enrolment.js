module.exports = (sequelize, Sequelize) => {
  const SkillEnrolment = sequelize.define("skill_enrolment", {
      skill_enrolment_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          field: 'skill_enrolment_id'
      },
      user_id: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      skill_id: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      skill_strength_id: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      expiry_date: {
          type: Sequelize.DATEONLY,
          allowNull: true
      },
      notes: {
          type: Sequelize.STRING,
          allowNull: true
      }
  }, {
      timestamps: false,
      freezeTableName: true,
      tableName: 'skill_enrolment'
  });

  SkillEnrolment.associate = (models) => {
      SkillEnrolment.belongsTo(models.user, {
          foreignKey: 'user_id',
          as: 'user'
      });
      SkillEnrolment.belongsTo(models.skill, {
          foreignKey: 'skill_id',
          as: 'skill'
      });
      SkillEnrolment.belongsTo(models.skillStrength, {
          foreignKey: 'skill_strength_id',
          as: 'skillStrength'
      });
  };

  return SkillEnrolment;
};
