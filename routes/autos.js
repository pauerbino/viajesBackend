var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Auto = require('../model/autoModel.js');
var Agencia = require('../model/agenciaModel.js');



router.get('/:retiro/:devolucion/:fechaRetiro/:fechaDevolucion', function(req, res, next) {
    var partesFechaRetiro = req.params.fechaRetiro.split('-');
    var partesFechaDevolucion = req.params.fechaDevolucion.split('-');
    var fechaComienzo; 
    var fechaFin;
    var fechaAAnalizar; 
    var responseAutos = [];
    Auto.find().populate('agencia').exec(function(err, rta) {
        if(err) return next(err);
        for(var auto of rta) {
            agenciaId = auto.agencia._id;
            autoFechasDisponibles = true;
            sucursalEnRetiro = false;
            sucursalEnDevolucion = false;
            for (var ciudadId of auto.agencia.ciudadSucursales) {
                if ((ciudadId == req.params.retiro)) {
                    sucursalEnRetiro = true;
                }
                else {
                    if ((ciudadId == req.params.devolucion)) {
                        sucursalEnDevolucion = true;
                    }
                }
            }
            fechaComienzo = new Date(partesFechaRetiro[2],partesFechaRetiro[1]-1,partesFechaRetiro[0]); 
            fechaFin = new Date(partesFechaDevolucion[2],partesFechaDevolucion[1]-1,partesFechaDevolucion[0]);
            console.log(auto.modelo);
            console.log(auto.fechasReservadas);
            for (var d = fechaComienzo; d <= fechaFin; d.setDate(d.getDate() + 1)) {
                fechaAAnalizar = (("0" + d.getDate()).slice(-2)) + "/" + (("0" + (d.getMonth() + 1)).slice(-2)) + "/" + d.getFullYear();
                console.log(fechaAAnalizar);
                if (auto.fechasReservadas.includes(fechaAAnalizar)) {
                    autoFechasDisponibles = false;
                }
            }
            if (autoFechasDisponibles && sucursalEnDevolucion && sucursalEnRetiro) {
                responseAutos.push(auto);
            }
        }       
        res.json(responseAutos);
    });
});

// router.get('/:id', function(req, res, next) {
//     List.findById(req.params.id).populate('contacts').exec(function(err, list) {
//         if (err) return next(err);
//         res.json(list);
//     });
// });

// router.post('/', function(req, res, next) {
//     var contactsList = [] ;
//     for(var c of req.body.contacts) {
//         contactsList.push(c._id);
//     }
//     var newList = new List ({
//         name : req.body.name,
//         contacts : contactsList
//     });
//     newList.save(function(err) {
//         if (err) throw err;
//         res.json(newList);
//     });
// });

// router.put('/:id', function(req, res, next) {
//     var contactsList = [] ;
//     for(var c of req.body.contacts) {
//         contactsList.push(c._id);
//     }
//     var body = {
//         name: req.body.name,
//         contacts: contactsList
//     }
//     List.findByIdAndUpdate(req.params.id, body, function (err, put) {
//         if (err) return next(err);
//         res.json(put);
//     });
// });

// router.delete('/:id', function(req, res, next) {
//     List.findByIdAndRemove(req.params.id, req.body, function (err, post) {
//         if (err) return next(err);
//         res.json(post);
//     });
// });

module.exports = router;
