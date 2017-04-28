'use strict'

const mongoose = require('mongoose');
const User = require('../models/user');
const services = require('../services');

function signUp(req, res) {
    const { email, password, displayName } = req.body;
    const user = new User({
        email,
        displayName,
        password
    })
    user.save((err, userStored) => {
        if (err) return res.status(500).send({ message: `Error al crear el usuario ${err}` })

        return res.status(200).send({ token: services.createToken(user) })
    });
}

function signIn(req, res) {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if(err) return res.status(500).send({message: err})
        if(!user) return res.status(404).send({message: 'User not found'});
        if(!user.validPassword(password)) return res.status(401).send({message: 'Invalid password'})
        res.status(200).send({
            message: 'Succes',
            token: services.createToken(user)
        })
    })
}

module.exports = {
    signIn,
    signUp
};
