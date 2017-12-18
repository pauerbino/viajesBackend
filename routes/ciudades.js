var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Ciudad = require('../model/ciudadModel.js');


router.get('/', function(req, res, next) {
    Ciudad.find(function (err, response) {
        if (err) return next(err);
        res.json(response);
    });
});

router.get('/:id', function(req, res, next) {
    Ciudad.findById(req.params.id).exec(function(err, response) {
        if (err) return next(err);
        res.json(response);
    });
});

router.post('/', function(req, res, next) {
    console.log(req);
    var nuevaCiudad = new Ciudad ({
        nombre: req.body.nombre,
        pais: req.body.pais
    });

    nuevaCiudad.save(function(err) {
        if (err) throw err;
        res.json(nuevaCiudad);
    });
});

router.put('/:id', function(req, res, next) {
    Ciudad.findByIdAndUpdate(req.params.id, req.body, function (err, put) {
        if (err) return next(err);
        res.json(put);
    });
});

router.delete('/:id', function(req, res, next) {
    Ciudad.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
