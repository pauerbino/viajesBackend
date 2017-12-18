var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AgenciaSchema = Schema({
    nombre : {type : String, default: ''},
    ciudadSucursales : [{ type: Schema.Types.ObjectId, ref: 'Ciudad' }]
});

var Agencia = mongoose.model('Agencia', AgenciaSchema );

module.exports = Agencia;
