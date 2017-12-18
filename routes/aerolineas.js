var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Aerolinea = require('../model/aerolineaModel.js');


router.get('/', function(req, res, next) {
    Aerolinea.find(function (err, response) {
        if (err) return next(err);
        res.json(response);
    });
});

router.get('/:id', function(req, res, next) {
    Aerolinea.findById(req.params.id).exec(function(err, response) {
        if (err) return next(err);
        res.json(response);
    });
});

module.exports = router;
