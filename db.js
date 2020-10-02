const {Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:    'postgres'
});

sequelize.authenticate()
    .then(() => console.log('postgres db is connected.'))
    .catch(err => console.log(err));

    const User = sequelize.import('./models/user');
    const AllSkill = sequelize.import('./models/allSkill');
    const UserSkill = sequelize.import('./models/userSkill');
    const Resource = sequelize.import('./models/resource');

    User.hasMany(UserSkill, {
            onDelete: 'cascade',
    });
    UserSkill.belongsTo(User);

    AllSkill.hasMany(UserSkill, {
            onDelete: 'cascade',
            onUpdate: 'cascade'
    });
    UserSkill.belongsTo(AllSkill);

    AllSkill.belongsToMany(Resource, {through: 'ResourceSkill'});
    Resource.belongsToMany(AllSkill, {through: 'ResourceSkill'});

module.exports = sequelize;