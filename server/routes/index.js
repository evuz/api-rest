'use strict'

const express = require('express');
const PickCtrl = require('../controllers/pick')
const UserCtrl = require('../controllers/user');
const { isAuth } = require('../middlewares/auth');
const api = express.Router();

api.get('/userstats', isAuth, PickCtrl.getUserStats);
api.post('/signup', UserCtrl.signUp);
api.post('/signin', UserCtrl.signIn);
api.get('/signin', isAuth, UserCtrl.validateToken);
api.get('/private', isAuth, function (req, res) {
    res.status(200).send({ message: 'Tienes acceso' });
});

module.exports = api;