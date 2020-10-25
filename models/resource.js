module.exports = (sequelize, DataTypes) => {
    const Resource = sequelize.define("resource", {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    });
  
    return Resource;
  };
  