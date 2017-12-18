var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReservaVueloSchema = Schema({
    vuelo : { type: Schema.Types.ObjectId, ref: 'Vuelo' },
    monto : {type : Number, default: 0}
});

var ReservaVuelo = mongoose.model('ReservaVuelo', ReservaVueloSchema );

module.exports = ReservaVuelo;
