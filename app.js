require('dotenv').config();

const express = require('express');
const app = express();
const sequelize = require('./db');

const user = require('./controllers/user-controller');
const allSkill = require('./controllers/all-skill-controller');
const userSkill = require('./controllers/user-skill-controller')
const resource = require('./controllers/resource-controller')


sequelize.sync();

// Forces the database to drop the tables and create them with the new models
// https://bezkoder.com/sequelize-associate-one-to-many/
// sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

app.use(express.json());

app.use(require('./middleware/headers'));

app.use('/user', user);
app.use('/allskills', allSkill);
app.use('/myskills', userSkill)
app.use('/resource', resource);


app.listen(process.env.PORT, function() { 
  console.log(`App is listening on port ${process.env.PORT}`);
}
);
