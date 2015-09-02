var express = require('express'),
    apiRouter = express.Router();

var authentication = require('./auth');

module.exports = function (app, passport) {
    // initialize all routes under /api/*
    authentication(app, passport);


    app.use('/api', apiRouter);
};