var jwt = require('jwt-simple');
var moment = require('moment');
var validator = require('validator');
var secret = '1234567890';

var authenticationHelper = require('./tokenHelper');

var User = require('../models/user')
var Token = require('../models/token');

module.exports = function (app, passport) {

    // secure all /api routes
    app.all('/api*', function (req, res, next) {
        var authorizationHeader = req.headers['authorization'];

        if (!authorizationHeader) {
            return res.status(401).send('Unauthorized.');
        }

        var split = authorizationHeader.split(' ');
        if (split[0].toLowerCase() != 'jwt') {
            return res.status(401).send('Unauthorized. Invalid header format.');
        }

        var jwtToken = split[1];

        authenticationHelper.validToken(jwtToken, function (err, valid) {
            if (err) {
                res.status(500).send(err);
            } else if (!valid) {
                res.status(401).send('Unauthorized. Invalid token.');
            } else {
                next();
            }
        });
    });

    // login user
    app.post('/login', function (req, res) {
        var facNumber = req.body.facNumber;
        var password = req.body.password;

        if (!(facNumber && password)) {
            return res.status(400).send("Bad request. Faculty number and password must be provided.");
        }

        if (!validator.isNumeric(facNumber)) {
            return res.status(400).send("Bad request. Faculty number must be only numbers.");
        }

        User.findOne({
            "facNumber": facNumber
        }, function (err, user) {
            if (err) {
                return res.status(500).send(err);
            }

            if (!user) {
                return res.status(400).send("Bad request. No user with that facNumber.");
            }

            if (!user.validPassword(password)) {
                return res.status(400).send("Bad request. Invalid password.");
            }

            authenticationHelper.getToken(user, function (err, token) {
                if (err) {
                    done(err);
                } else {
                    res.json({
                        token: token,
                        user: user
                    });
                }
            });
        });
    });

    // register new user
    app.post('/signup', function (req, res) {
        var facNumber = req.body.facNumber;
        var password = req.body.password;

        if (!(facNumber && password)) {
            return res.status(400).send("Bad request. Faculty number and password must be provided.");
        }

        if (!validator.isNumeric(facNumber)) {
            return res.status(400).send("Bad request. Faculty number must contain only numbers.");
        }

        User.findOne({
            'facNumber': facNumber
        }, function (err, user) {
            if (err) {
                return res.status(500).send(err);
            }

            if (user) {
                return res.status(409).send("User with that faculty number already exists");
            } else {
                var newUser = new User(req.body);
                newUser.password = newUser.generateHash(password);

                newUser.save(function (err) {
                    if (err) {
                        return res.status(500).send(err);
                    }

                    delete newUser._id;
                    delete newUser.password;

                    return res.json({
                        result: newUser
                    });
                });
            }
        });
    });
};