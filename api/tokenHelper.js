var jwt = require('jwt-simple');
var moment = require('moment');

var secret = '1234567890';

var User = require('../models/user');
var Token = require('../models/token');

// operations with tokens 
module.exports = {
    // checks if the token is valid
    validToken: function (jwtToken, done) {
        Token.findOne({
            token: jwtToken
        }, function (err, token) {

            if (err) {
                return done(err);
            }
            if (!token) {
                return done(null, false);
            }
            if (token.expire < moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')) {
                return done(null, false);
            }
            User.findById(token.userId, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }

                var decoded = jwt.decode(jwtToken, secret);
                if (decoded.userId == user._id) {
                    done(null, true);
                } else {
                    done(null, false);
                }
            })
        });
    },

    // if the user already has a token, extend the token and 
    getToken: function (user, done) {
        Token.findOne({
            userId: user._id,
            expire: {
                $gt: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }
        }, function (err, token) {
            if (err) {
                done(err)
            }

            var expire = moment(Date.now()).add(1, 'days').format('YYYY-MM-DD HH:mm:ss');
            if (token) {
                // this extention is to not deal with expired tokens
                // possible db fluding of expired tokens
                Token.update(token, {
                    expire: expire
                });
                done(null, token);
            } else {
                var token = new Token();

                token.token = jwt.encode({
                    userId: user._id
                }, secret);
                token.expire = expire;
                token.userId = user._id;

                Token.create(token, function (err, result) {
                    if (err) {
                        done(err);
                    } else {
                        done(null, token);
                    }
                });
            }
        })
    }
}