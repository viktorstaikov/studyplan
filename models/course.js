var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var days = ["Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота", "Неделя"];

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

courseSchema.methods.isValid = function () {
    if (this.from > this.to) {
        return false;
    }

    if (days.indexOf(this.day) < 0) {
        return false;
    }

    return true;
}

module.exports = mongoose.model('Course', courseSchema);