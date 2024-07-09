module.exports = (sequelize, Sequelize) => {
  const Department = sequelize.define("department",
  {
      department_id:{
          type: Sequelize.INTEGER,
          primaryKey:true,
          field: 'department_id'
      },
      department_name: {
          type: Sequelize.STRING
      },
  },

  {
      timestamps: false,
      freezeTableName: true,
      tableName: 'department'
  }
  );

  return Department;
}; 