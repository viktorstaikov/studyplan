var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tokenSchema = Schema({
    token: String,
    expire: Date,
    userId: Schema.Types.ObjectId
});

module.exports = mongoose.model('Token', tokenSchema);