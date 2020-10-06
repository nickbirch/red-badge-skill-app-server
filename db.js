const {Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:    'postgres'
});

sequelize.authenticate()
    .then(() => console.log('postgres db is connected.'))
    .catch(err => console.log(err));

    const User = sequelize.import('./models/user');
    const Tag = sequelize.import('./models/tag');
    const UserSkill = sequelize.import('./models/userSkill');
    const Resource = sequelize.import('./models/resource');
    const ResourceTag = sequelize.import('./models/resourceTag');

    User.hasMany(UserSkill, {
            onDelete: 'cascade',
    });
    UserSkill.belongsTo(User);

    Tag.hasMany(UserSkill, {
            onDelete: 'cascade',
            onUpdate: 'cascade'
    });
    UserSkill.belongsTo(Tag);
    
    Tag.belongsToMany(Resource, {through: ResourceTag});
    Resource.belongsToMany(Tag, {through: ResourceTag});

module.exports = sequelize;