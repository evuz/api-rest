'use strict'

const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const api = require('./routes');
const cors = require('./middlewares/cors');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors);
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')))
app.use(express.static('public'));
app.engine('.hbs', hbs({
    defaultLayout: 'default',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use('/api', api);
app.get('/', (req, res) => {
    res.render('react')
});

module.exports = app;