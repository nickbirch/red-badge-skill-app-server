const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user');

const validateSession = (req, res, next) => {

    const token = req.headers.authorization;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        // console.log('token: ', token);
        // console.log('decoded: ', decoded);
        if (!err && decoded) {
            User.findOne({ where: {id: decoded.id}})
            .then(user => {
                if(!user) throw 'err';
                // Need to return all the properties of the user?
                // req.user = user;
                req.user = {id:user.id, isAdmin: user.isAdmin};
                return next();
            })
            .catch(err => next(err))
        } else {
            req.errors = err;
            return res.status(401).send('Unauthorized')
        };

    });
};

module.exports = validateSession;