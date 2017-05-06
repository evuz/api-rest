'use strict'

const Pick = require('../models/pick');
const User = require('../models/user');

function getUserStats(req, res) {
    let fieldId = req.params.fieldId;
    const userId = req.user;

    console.log(userId);

    Pick.find({author: userId}, (err, user) => {
        console.log(user);
        // if (err) return res.status(500).send({
        //     message: `Error al realizar ` +
        //     `la petición ${err}`
        // });
        // if (!field) return res.status(404).send({ message: 'El campo no existe' });

        // res.status(200).send({ field });
    });
}

module.exports = {
    getUserStats,
}