'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Field = require('../models/field')

var app = express();

var port = process.env.PORT ||  3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/field', (req, res) => {
    res.status(200).send({ field: [] });
});

app.get('/api/field/:fieldId', (req, res) => {

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

    field.save((err, productStore) => {
        if (err) res.status(500).send({message: `Error al` + 
            `salvar en la base de datos ${err}`})
        res.status(200).send({product: productStore});
    });
});

app.put('/api/field/:fieldId', (req, res) => {

});

app.delete('/api/field/:fieldId', (req, res) => {

});

mongoose.connect('mongodb://localhost:27017/api', (err, res) => {
    if(err) {
        return console.log(`Error al conectar con la base de datos: ${err}`);
    }
    console.log('Conexión a la base de datos realizada');

    app.listen(port, () => {
        console.log(`Servidor iniciado en http://localhost:${port}`);
    })
});