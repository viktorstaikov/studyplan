var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var serveStatic = require('serve-static');

var port = process.env.PORT || 3000;

// configuration ===========================================
var db = require('./config/db');
mongoose.connect(db.url);

//middlewares ==============================================
app.use(morgan('dev')); //request logging

app.use(bodyParser.json()); // standart JSON media type
app.use(bodyParser.json({
    type: 'application/vnd.api+json' // requered for JSON API http://jsonapi.org/format/
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));

app.use(passport.initialize());

// routes ==================================================
app.get('/', function (req, res) {
    res.sendfile('./public/index.html');
});

// api =====================================================
require('./api/routes.js')(app, passport);

// start app ===============================================
app.listen(port);
console.log('Server is listenint on port ' + port);

exports = module.exports = app;