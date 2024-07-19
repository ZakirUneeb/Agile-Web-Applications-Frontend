// Johnathan
module.exports = (sequelize, Sequelize) => {
    const Skill = sequelize.define("skill", {
        skill_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'skill_id'
        },
        skill_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        skill_category_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'skill'
    });

    Skill.associate = (models) => {
        Skill.belongsTo(models.skillCategory, {
            foreignKey: 'skill_category_id',
            as: 'skillCategory'
        });
    };

    return Skill;
};