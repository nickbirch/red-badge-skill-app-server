module.exports = (sequelize, DataTypes) => {
    const UserSkill = sequelize.define("userSkill", {
      skillName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      activeLearning: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    });
  
    return UserSkill;
  };
  