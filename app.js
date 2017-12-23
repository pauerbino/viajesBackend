var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var db_dir = process.env.MONGODB_URI;

const cors = require('cors');


mongoose.Promise = global.Promise;

//mongoose.connect('mongodb://localhost:27017/viajes', {useMongoClient: true})
//  .then(() =>  console.log('connection successful'))
//  .catch((err) => console.error(err));

mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'mongodb://localhost/viajes', {useMongoClient: true})
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

var autos = require('./routes/autos');
var aerolineas = require('./routes/aerolineas');
var ciudades = require('./routes/ciudades');
var hoteles = require('./routes/hoteles');
var paquetes = require('./routes/paquetes');
var users = require('./routes/users');
var vuelos = require('./routes/vuelos');
var register = require('./routes/register');
var vuelos = require('./routes/vuelos');
var app = express();
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(passport.initialize());
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/v1/aerolineas', aerolineas);
app.use('/api/v1/autos', autos);
app.use('/api/v1/ciudades', ciudades);
app.use('/api/v1/hoteles', hoteles);
app.use('/api/v1/paquetes', paquetes);
app.use('/api/v1/users', users);
app.use('/api/v1/vuelos', vuelos);
app.use('/api/v1/register', register);
app.use('/api/v1/vuelos', vuelos);

require('./config/passport');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
