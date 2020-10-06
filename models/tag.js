module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define("tag", {
      skillName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    });

    return Tag;
  };
  