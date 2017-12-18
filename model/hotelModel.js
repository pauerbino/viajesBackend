var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HotelSchema = Schema({
    nombre : {type : String, default: ''},
    direccion : {type : String, default: ''},
    estrellas : {type : Number, default: 0},
    cantidadHabitacionesDisponibles : {type : Number, default: 0},
    cantidadHabitaciones : {type : Number, default: 0},
    monto : {type : Number, default: 0},
    ciudad : [{ type: Schema.Types.ObjectId, ref: 'Ciudad' }],
    url: {type : String, default: ''}
});

var Hotel = mongoose.model('Hotel', HotelSchema );

module.exports = Hotel;
