var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CiudadSchema = Schema({
    nombre : {type : String, default: ''},
    pais : {type : String, default: ''}
});

var Ciudad = mongoose.model('Ciudad', CiudadSchema );

module.exports = Ciudad;
