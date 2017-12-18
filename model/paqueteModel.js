var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaqueteSchema = Schema({
    usuario : { type: Schema.Types.ObjectId, ref: 'User' },
    reservaAuto : [{ type: Schema.Types.ObjectId, ref: 'ReservaAuto' }],
    reservaHotel : [{ type: Schema.Types.ObjectId, ref: 'ReservaHotel' }],
    reservaVuelo : [{ type: Schema.Types.ObjectId, ref: 'ReservaVuelo' }],
    pagado: {type : Boolean, default: false},
    montoTotal: {type: Number, default: 0},
    fechaPago: {type: Date},
    nombre: {type : String, default: 'Mi paquete'}
});

var Paquete = mongoose.model('Paquete', PaqueteSchema );

module.exports = Paquete;
