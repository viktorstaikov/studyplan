var express = require("express");
var router = express.Router();
var CourseSelection = require("../models/courseSelection");

module.exports = function (app, passport) {

    router.post("/:userId/:courseId", function (req, res, next) {
        var rawSelection = {
            userId: req.params.userId,
            courseId: req.params.courseId
        };
        var newSelection = new CourseSelection(rawSelection);

        CourseSelection.findOne({
            userId: req.params.userId,
            courseId: req.params.courseId
        }, function (err, result) {
            if (err) {
                return res.status(500).send(err);
            }
            if (result) {
                handleResult(err, result, res);
            } else {
                CourseSelection.create(newSelection, function (err, result) {
                    handleResult(err, result, res);
                });
            }
        });
    });

    router.get("/:userId", function (req, res, next) {
        CourseSelection.find({
            userId: req.params.userId
        }, function (err, result) {
            handleResult(err, result, res);
        });
    });

    router.delete("/:userId/:courseId", function (req, res, next) {
        CourseSelection.remove({
            userId: req.params.userId,
            courseId: req.params.courseId
        }, function (err, result) {
            handleResult(err, result, res);
        });
    });

    app.use("/selection", router);
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