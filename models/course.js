var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Дисциплина,Група,Преподавател,Вид занятие,Ден,от,до,Зала
// name, group, teacher, type, day, from, to, room
var courseSchema = Schema({
    name: String,
    group: String,
    teacher: String,
    type: String,
    day: String,
    from: Number,
    to: Number,
    room: String
});

module.exports = mongoose.model('Course', courseSchema);