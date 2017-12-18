var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReservaAutoSchema = Schema({
    auto : { type: Schema.Types.ObjectId, ref: 'Auto' },
    lugarRetiro : { type: Schema.Types.ObjectId, ref: 'Ciudad' },
    lugarDevolucion : { type: Schema.Types.ObjectId, ref: 'Ciudad' },
    fechaRetiro: {type: Date},
    fechaDevolucion: {type: Date},
    monto : {type : Number, default: 0}
});

var ReservaAuto = mongoose.model('ReservaAuto', ReservaAutoSchema );

module.exports = ReservaAuto;
