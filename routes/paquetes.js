var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Paquete = require('../model/paqueteModel.js');
var ReservaHotel = require('../model/reservaHotelModel.js');
var ReservaVuelo = require('../model/reservaVueloModel.js');
var ReservaAuto = require('../model/reservaAutoModel.js');
var Vuelo = require('../model/vueloModel.js');
var Auto = require('../model/autoModel.js');
var Hotel = require('../model/hotelModel.js');
var User = require('../model/userModel.js');

router.get('/', function(req, res, next) {
    Paquete.find(function (err, response) {
        if (err) return next(err);
        res.json(response);
    });
});

router.get('/miPaquete/:id', function(req, res, next) {
    console.log("Aca estoy recibiendo el ID");
    console.log(req.params.id);
    Paquete.findById(req.params.id).populate({
        path: 'reservaVuelo',
        populate: { path: 'vuelo',
            populate:  [{ path: 'aerolinea'},{ path: 'ciudadOrigen'},{ path: 'ciudadDestino'}]
        }
      }).populate({
        path: 'reservaHotel',
        populate: { path: 'hotel',
            populate: { path: 'ciudad'}
        }
      }).populate({
        path: 'reservaAuto',
        populate: [{ path: 'auto', populate: {path: 'agencia'} },{ path: 'lugarRetiro' }, { path: 'lugarDevolucion' }]
      }).exec(function(err, paquete) {
        if (err) return next(err);
        res.json(paquete);
    });
});

router.get('/:email', function(req, res, next) {
    User.find({"email": req.params.email}).exec(function(err,u) {
        console.log(u);
        Paquete.find({"usuario" : u[0]._id, "pagado": true}).populate({
            path: 'reservaVuelo',
            populate: { path: 'vuelo',
                populate:  [{ path: 'aerolinea'},{ path: 'ciudadOrigen'},{ path: 'ciudadDestino'}]
            }
        }).populate({
            path: 'reservaHotel',
            populate: { path: 'hotel',
                populate: { path: 'ciudad'}
            }
        }).populate({
            path: 'reservaAuto',
            populate: [{ path: 'auto', populate: {path: 'agencia'} },{ path: 'lugarRetiro' }, { path: 'lugarDevolucion' }]
        }).exec(function(err, paquetes) {
            if (err) return next(err);
            res.json(paquetes);
        });
    });
});


router.get('/habilitado/:email', function(req, res, next) {
    console.log("se buscara paquete actual o se creara uno en su defecto");
    User.find({"email": req.params.email}).exec(function(err,u) {
        Paquete.find({"usuario" : u[0]._id, "pagado": false}).populate({
            path: 'reservaVuelo',
            populate: { path: 'vuelo',
                populate:  [{ path: 'aerolinea'},{ path: 'ciudadOrigen'},{ path: 'ciudadDestino'}]
            }
        }).populate({
            path: 'reservaHotel',
            populate: { path: 'hotel',
                populate: { path: 'ciudad'}
            }
        }).populate({
            path: 'reservaAuto',
            populate: [{ path: 'auto', populate: {path: 'agencia'} },{ path: 'lugarRetiro' }, { path: 'lugarDevolucion' }]
        }).exec(function(err, paquete) {
            if (err) return next(err);
            if (paquete.length > 0) {
                console.log("se devuelve el paquete actual que no esta pagado");
                console.log(paquete[0]);
                res.json(paquete[0]);
            }
            else {
                console.log("no tiene paquete por lo que se crea uno");
                console.log(u[0]);
                var newPaquete = new Paquete ({
                    usuario: u[0]._id,
                    reservaAuto: [], 
                    reservaHotel: [],
                    reservaVuelo: [],
                    pagado: false
                });
                console.log(newPaquete);
                newPaquete.save(function(err) {
                    if (err) throw err;
                    console.log("se creo el paquete");
                    console.log(newPaquete);
                    res.json(newPaquete);
                });
            }
        });
    });
});

router.post('/ReservaHotel', function(req, res, next) {
    var partesFechaIngreso = req.body.fechaIngreso.split('-');
    var partesFechaSalida = req.body.fechaSalida.split('-');
    var fechaComienzo = new Date(partesFechaIngreso[2],partesFechaIngreso[1]-1,partesFechaIngreso[0]); 
    var fechaFin = new Date(partesFechaSalida[2],partesFechaSalida[1]-1,partesFechaSalida[0]);
    var fechaComienzoParaContar = new Date(partesFechaIngreso[2],partesFechaIngreso[1]-1,partesFechaIngreso[0]); 
    var cantDias = 0;
    //Porque se cobra por noche. Si voy del 20 al 25, son 5 dias.
    for (var d = fechaComienzoParaContar; d < fechaFin; d.setDate(d.getDate() + 1)) {
        cantDias++;
    }
    var montoTotal = req.body.monto * cantDias; 

    var nuevaReserva = new ReservaHotel ({
        hotel: req.body.hotel,
        monto: montoTotal,
        fechaIngreso: fechaComienzo,
        fechaSalida: fechaFin
    });

    nuevaReserva.save(function(err) {
        if (err) throw err;
    });

    Paquete.findById(req.body.idPaquete).exec(function(err, paquete) {
        if (err) return next(err);
        paquete.montoTotal = paquete.montoTotal + montoTotal;
        paquete.reservaHotel.push(nuevaReserva);
        paquete.save(function(err) {
            if (err) throw err;
            res.json(paquete);
        });
    });

});

router.post('/ReservaVuelo', function(req, res, next) {
    var nuevaReserva = new ReservaVuelo ({
        vuelo: req.body.vuelo,
        monto: req.body.monto
    });

    nuevaReserva.save(function(err) {
        if (err) throw err;
    });

    Paquete.findById(req.body.idPaquete).exec(function(err, paquete) {
        if (err) return next(err);
        paquete.montoTotal = paquete.montoTotal + req.body.monto;
        paquete.reservaVuelo.push(nuevaReserva);
        paquete.save(function(err) {
            if (err) throw err;
            res.json(paquete);
        });
    });
});

router.post('/ReservaAuto', function(req, res, next) {
    var partesFechaRetiro = req.body.fechaRetiro.split('-');
    var partesFechaDevolucion = req.body.fechaDevolucion.split('-');
    var fechaComienzo = new Date(partesFechaRetiro[2],partesFechaRetiro[1]-1,partesFechaRetiro[0]); 
    var fechaFin = new Date(partesFechaDevolucion[2],partesFechaDevolucion[1]-1,partesFechaDevolucion[0]);
    var fechaComienzoParaContar = new Date(partesFechaRetiro[2],partesFechaRetiro[1]-1,partesFechaRetiro[0]); 
    var cantDias = 0;
    for (var d = fechaComienzoParaContar; d <= fechaFin; d.setDate(d.getDate() + 1)) {
        cantDias++;
    }
    var montoTotal = req.body.monto * cantDias;
    var nuevaReserva = new ReservaAuto ({
        auto: req.body.auto,
        monto: montoTotal,
        lugarRetiro: req.body.lugarRetiro,
        lugarDevolucion: req.body.lugarDevolucion,
        fechaRetiro: fechaComienzo,
        fechaDevolucion: fechaFin
    });

    nuevaReserva.save(function(err) {
        if (err) throw err;
    });

    Paquete.findById(req.body.idPaquete).exec(function(err, paquete) {
        if (err) return next(err);
        paquete.montoTotal = paquete.montoTotal + montoTotal;
        paquete.reservaAuto.push(nuevaReserva);
        paquete.save(function(err) {
            if (err) throw err;
            res.json(paquete);
        });
    });
});

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

router.put('/pagar/:id/:nombrePaquete', function(req, res, next) {
    Paquete.findById(req.params.id).populate('reservaVuelo reservaHotel reservaAuto').exec(function(err, paquete) {
        console.log(paquete);
        var fecha;
        var fechasReservadas;
        var fechaComienzo;
        var fechaFin;
        console.log("Se empiezan a gurdar reservas");
        for (var i = 0; i < paquete.reservaAuto.length; i++) {
            fechaComienzo = paquete.reservaAuto[i].fechaRetiro;
            fechaFin = paquete.reservaAuto[i].fechaDevolucion;
            fechasReservadas = [];
            Auto.findById(paquete.reservaAuto[i].auto).exec(function(err, auto) {
                fechasReservadas = auto.fechasReservadas;
                for (var d = fechaComienzo; d <= fechaFin; d.setDate(d.getDate() + 1)) {
                    fecha = (("0" + d.getDate()).slice(-2)) + "/" + (("0" + (d.getMonth() + 1)).slice(-2)) + "/" + d.getFullYear();
                    fechasReservadas.push(fecha);
                }
                auto.fechasReservadas = fechasReservadas;
                auto.save(function(err) {
                    if (err) throw err;
                });
            });
        }
        console.log("se guardo reserva auto");

        for (var i = 0; i < paquete.reservaVuelo.length; i++) {
            Vuelo.findById(paquete.reservaVuelo[i].vuelo).exec(function(err, vuelo) {
                vuelo.cantPasajerosDisp --;
                vuelo.save(function(err) {
                    if (err) throw err;
                });
            });
        }
        console.log("se guardo reserva vuelo");

        for (var i = 0; i < paquete.reservaHotel.length; i++) {
            Hotel.findById(paquete.reservaHotel[i].hotel).exec(function(err, hotel) {
                hotel.cantidadHabitacionesDisponibles --;
                hotel.save(function(err) {
                    if (err) throw err;
                });
            });
        }
        console.log("se guardo reserva hotel");

        if (err) return next(err);
        paquete.pagado = true;
        paquete.fechaPago = new Date();
        paquete.nombre = req.params.nombrePaquete;
        console.log("hasta aca ok. se guarda paquete");
        console.log(paquete);
        paquete.save(function(err) {
            if (err) throw err;
            res.json(paquete);
        });
    });
});

router.delete('/quitarVuelo/:idReserva/:idPaquete', function(req, res, next) {
    var monto;
    ReservaVuelo.findByIdAndRemove(req.params.idReserva, req.body, function (err, post) {
        if (err) return next(err);
        monto = post.monto;
        var reservasVuelo = [];
        var index;
        Paquete.findById(req.params.idPaquete).exec(function(err, paquete) {
            if (err) return next(err);
            reservasVuelo = paquete.reservaVuelo;
            index = reservasVuelo.indexOf(req.params.idReserva);
            if (index > -1) {
                reservasVuelo.splice(index, 1);
            }
            paquete.reservaVuelo = reservasVuelo;
            console.log(paquete.montoTotal);
            console.log(monto);
            paquete.montoTotal = paquete.montoTotal - monto;
            paquete.save(function(err) {
                if (err) throw err;
                res.json(paquete);
            });
        }); 
    });
});

router.delete('/quitarAuto/:idReserva/:idPaquete', function(req, res, next) {
    var monto;
    ReservaAuto.findByIdAndRemove(req.params.idReserva, req.body, function (err, post) {
         if (err) return next(err);
         monto = post.monto;
         var reservasAutos = [];
        var index;
        Paquete.findById(req.params.idPaquete).exec(function(err, paquete) {
            if (err) return next(err);
            reservasAutos = paquete.reservaAuto;
            index = reservasAutos.indexOf(req.params.idReserva);
            if (index > -1) {
                reservasAutos.splice(index, 1);
            }
            paquete.reservaAuto = reservasAutos;
            console.log(paquete.montotTotal);
            console.log(monto);
            paquete.montoTotal = paquete.montoTotal - monto;
            paquete.save(function(err) {
                if (err) throw err;
                res.json(paquete);
            });
        }); 
    });
});


router.delete('/quitarHotel/:idReserva/:idPaquete', function(req, res, next) {
    var monto;
    ReservaHotel.findByIdAndRemove(req.params.idReserva, req.body, function (err, post) {
        if (err) return next(err);
        monto = post.monto;
        var reservasHotel = [];
        var index;
        Paquete.findById(req.params.idPaquete).exec(function(err, paquete) {
            if (err) return next(err);
            reservasHotel = paquete.reservaHotel;
            index = reservasHotel.indexOf(req.params.idReserva);
            if (index > -1) {
                reservasHotel.splice(index, 1);
            }
            paquete.reservaHotel = reservasHotel;
            paquete.montoTotal = paquete.montoTotal - monto;
            paquete.save(function(err) {
                if (err) throw err;
                res.json(paquete);
            });
        }); 
    });
});

module.exports = router;
