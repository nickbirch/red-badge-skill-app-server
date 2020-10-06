module.exports = (sequelize, DataTypes) => {
    const UserSkill = sequelize.define("userSkill", {
      activeLearning: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    });
  
    return UserSkill;
  };
  