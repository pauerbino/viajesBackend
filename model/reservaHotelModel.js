var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReservaHotelSchema = Schema({
    hotel : { type: Schema.Types.ObjectId, ref: 'Hotel' },
    monto : {type : Number, default: 0},
    fechaIngreso : {type: Date}, 
    fechaSalida : {type: Date}
});

var ReservaHotel = mongoose.model('ReservaHotel', ReservaHotelSchema );

module.exports = ReservaHotel;
