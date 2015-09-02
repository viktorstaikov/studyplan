var express = require('express'),
    apiRouter = express.Router();

var authentication = require('./auth');
var courses = require('./courses')

module.exports = function (app, passport) {
    // initialize all routes under /api/*
    authentication(app, passport);
    courses(apiRouter, passport);

    app.use('/api', apiRouter);
};