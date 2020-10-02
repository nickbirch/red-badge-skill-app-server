module.exports = (sequelize, DataTypes) => {
    const AllSkill = sequelize.define("allSkill", {
      skillName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    });

    return AllSkill;
  };
  