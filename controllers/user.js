'use strict'

const mongoose = require('mongoose');
const User = require('../models/user');
const services = require('../services');

function signUp(req, res) {
    const { email } = req.body;
    const user = new User({
        email,
        displayName: req.body.email,
    })

    user.save((err, userStored) => {
        if (err) res.status(500).send({ message: `Error al crear el usuario ${err}` })

        return res.status(200).send({ token: service.createToken(user) })
    });
}

function signIn(res, res) {
    const { email } = req.body;
    User.find({ email }, (err, user) => {
        if(err) res.status(500).send({message: err})
        if(!user) res.status(404).send({message: 'User not found'});

        req.user = user;
        res.send(200).send({
            message: 'Succes',
            token: service.createToken(user)
        })
    })
}

module.exports = {
    signIn,
    signUp
};