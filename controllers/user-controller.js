const router = require('express').Router();
const User = require('../db').import('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* ***********************************
 *** User Registration ***
*********************************** */
router.post('/register', function(req, res) {

    User.create({
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        email:   req.body.user.email,
        password:   bcrypt.hashSync(req.body.user.password),
        isAdmin: req.body.user.isAdmin
    })
    .then(
        createSuccess = (user) => {
            let token = jwt.sign({id: user.id, isAdmin: user.isAdmin}, process.env.JWT_SECRET, {expiresIn: '1d'});
            // userID = user.id;
            // isAdmin = user.isAdmin;
            
            res.json({
                id:   user.id,
                isAdmin: user.isAdmin,
                message:    'User successfully created.',
                sessionToken:   token
            });
        },
        createError = (err) => res.status(500).json(err)
    )

    .catch(err => res.status(500).json({error: err}))

});

/* ***********************************
 *** User Login ***
*********************************** */
router.post('/login', function(req, res) {

    User.findOne({where: {email: req.body.user.email}})
    .then(
        loginSuccess = (user) => {
            if (user) {
                bcrypt.compare(req.body.user.password, user.password, (err, matches) => {
                    if (matches) {
                        let token = jwt.sign({id: user.id, isAdmin: user.isAdmin}, process.env.JWT_SECRET, {expiresIn: '1d'});
                        res.status(200).json({
                            // Need to return all the properties of the user to the browser?
                            // user:   user,
                            id:   user.id,
                            isAdmin: user.isAdmin,
                            message:    'Successfully authenticated user.',
                            sessionToken:   token
                        });
                    } else {
                        res.status(401).json({error: 'Login failed.'});
                    };
                })
            } else {
                res.status(401).json({error: 'Failed to authenticate.'});
            };
        },
        err => res.status(501).send({error: 'Failed to process.'})
    )
    .catch(err => res.status(500).json({error: err}))
});


module.exports = router;