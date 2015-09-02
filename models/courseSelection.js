var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var selectionSchema = Schema({
    userId: Schema.Types.ObjectId,
    courseId: Schema.Types.ObjectId
});


module.exports = mongoose.model('CourseSelection', selectionSchema);