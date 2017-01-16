'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Field = require('../models/field')

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/field', (req, res) => {
    Field.find({}, (err, field) => {
        if (err) return res.status(500).send({
            message: `Error al realizar ` +
            `la petición ${err}`
        });
        if (!field) return res.status(404).send({ message: 'El campo no existe' });

        res.status(200).send({ field });
    });
});

app.get('/api/field/:fieldId', (req, res) => {
    let fieldId = req.params.fieldId;

    Field.findById(fieldId, (err, field) => {
        if (err) return res.status(500).send({
            message: `Error al realizar ` +
            `la petición ${err}`
        });
        if (!field) return res.status(404).send({ message: 'El campo no existe' });

        res.status(200).send({ field });
    });
});

app.post('/api/field', (req, res) => {
    console.log('POST /api/field');
    console.log(req.body);

    let field = Field();
    field.name = req.body.name;
    field.description = req.body.description;
    field.image = req.body.image;
    field.city = req.body.city;
    field.category = req.body.category;
    field.stars = req.body.stars;

    field.save((err, fieldStored) => {
        if (err) res.status(500).send({
            message: `Error al` +
            `guardar en la base de datos ${err}`
        })
        res.status(200).send({ field: fieldStored });
    });
});

app.put('/api/field/:fieldId', (req, res) => {
    let fieldId = req.params.fieldId;
    let update = req.body;

    Field.findByIdAndUpdate(fieldId, update, (err, fieldUpdate) => {
        if (err) res.status(500).send({
            message: `Error al` +
            `actualizar el elemento de la base de datos ${err}`
        });
        res.status(200).send({field: fieldUpdate});
    })
});

app.delete('/api/field/:fieldId', (req, res) => {
    let fieldId = req.params.fieldId;

    Field.findById(fieldId, (err, field) => {
        if (err) res.status(500).send({
            message: `Error al` +
            `obtener el elemento de la base de datos ${err}`
        });
        field.remove(err => {
            if (err) res.status(500).send({
                message: `Error al` +
                `borrar el elemento de la base de datos ${err}`
            });
            res.status(200).send({ message: 'Elemento eliminado' });
        })
    });
});

mongoose.connect('mongodb://localhost:27017/api', (err, res) => {
    if (err) {
        return console.log(`Error al conectar con la base de datos: ${err}`);
    }
    console.log('Conexión a la base de datos realizada');

    app.listen(port, () => {
        console.log(`Servidor iniciado en http://localhost:${port}`);
    })
});
