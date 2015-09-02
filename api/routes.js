var express = require('express'),
    apiRouter = express.Router();

var authentication = require('./auth');
var courses = require('./courses');
var selections = require('./courseSelections');

module.exports = function (app, passport) {
    // initialize all routes under /api/*
    authentication(app, passport);
    courses(apiRouter, passport);
    selections(apiRouter, passport);

    app.use('/api', apiRouter);
};