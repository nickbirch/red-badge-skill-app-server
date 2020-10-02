module.exports = (sequelize, DataTypes) => {
    const ResourceSkill = sequelize.define('ResourceSkill', {
        resourceId: DataTypes.INTEGER,
        allSkillId: DataTypes.INTEGER
      }
    );
    return ResourceSkill;
  };