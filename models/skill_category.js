// Johnathan
module.exports = (sequelize, Sequelize) => {
    const SkillCategory = sequelize.define("skill_category", {
        skill_category_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'skill_category_id'
        },
        skill_category_name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'skill_category'
    });

    SkillCategory.associate = (models) => {
        SkillCategory.hasMany(models.skill, {
            foreignKey: 'skill_category_id',
            as: 'skills'
        });
    };

    return SkillCategory;
};