var express = require("express");
var router = express.Router();
var Course = require("../models/course");

module.exports = function (app, passport) {

    router.post("/bootstrap", function (req, res, next) {
        insertSample(function (err, result) {
            handleResult(err, result, res);
        });
    });

    router.post("/reset", function (req, res, next) {
        Course.remove({}, function (err, course) {
            if (err) {
                res.status(500).json({
                    error: err
                });
                return;
            }
            insertSample(function (err, result) {
                handleResult(err, result, res);
            });
        });
    });

    router.post("/", function (req, res, next) {
        var newCourse = new Course(req.body);

        if (!newCourse.isValid()) {
            res.status(400).json({
                error: "Invalid course description."
            });
        }

        Course.create(newCourse, function (err, result) {
            handleResult(err, result, res);
        });
    });

    router.get("/", function (req, res, next) {
        Course.find(function (err, courses) {
            handleResult(err, courses, res);
        });
    });

    router.get("/:id", function (req, res, next) {
        Course.findOne({
            _id: req.params.id
        }, function (err, course) {
            handleResult(err, course, res);
        });
    });

    router.delete('/:id', function (req, res, next) {
        Course.remove({
            _id: req.params.id
        }, function (err, course) {
            if (err) {
                res.status(500).json({
                    error: err
                });
                return;
            }
            Course.find(function (err, result) {
                handleResult(err, result, res);
            });
        });
    });

    router.delete("/", function (req, res, next) {
        Course.remove({}, function (err, course) {
            if (err) {
                res.status(500).json({
                    error: err
                });
                return;
            }
            Course.find(function (err, result) {
                handleResult(err, result, res);
            });
        })
    });

    app.use("/course", router);
};

function handleResult(err, result, res) {
    if (err) {
        res.status(500).json({
            error: err
        });
    } else {
        res.json({
            result: result
        });
    }
}

function bulkInsert(courses, done) {
    var newCourses = [];
    for (var i = 0; i < courses.length; i++) {
        var newCourse = new Course(courses[i]);

        if (!newCourse.isValid()) {
            done({
                error: "Item at possition " + (i + 1) + " / " + newCourse.name + " is not a valid Course."
            });
            return;
        }

        newCourses.push(newCourse);
    };

    Course.create(newCourses, function (err, created) {
        if (err) {
            done(err);
        } else {
            done(null, newCourses.length);
        }
    });
}

function insertSample(done) {
    var rawCourses = require('../models/sample-courses');

    if (!Array.isArray(rawCourses) || rawCourses.length < 1) {
        res.status(400).json({
            error: "Array must be passed. Fix your sample courses."
        });
    }

    bulkInsert(rawCourses, done);
}