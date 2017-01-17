'use strict'

const mongoose = require('mongoose');
const User = require('../models/user');
const services = require('../services');

function signUp(req, res) {
    const user = new User({
        email: req.body.email,
        displayName: req.body.email,
    })

    user.save((err, userStored) => {
        if (err) res.status(500).send({ message: `Error al crear el usuario ${err}` })

        return res.status(200).send({ token: service.createToken(user) })
    });
}

function signIn(res, res) {

}

module.exports = {
    signIn,
    signUp
};