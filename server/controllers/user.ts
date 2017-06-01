import * as mongoose from 'mongoose';
import { User } from '../models/user';
import * as tokenSrv from '../services/token';

function signUp(req, res) {
    const { email, password, displayName } = req.body;
    const user = new User({
        email,
        displayName,
        password
    })
    user.save((err, userStored) => {
        if (err) return res.status(500).send({
            message: 'Error al crear el usuario',
            error: err
        })

        return res.status(200).send({
            displayName,
            email,
            token: tokenSrv.createToken(user)
        })
    });
}

function signIn(req, res) {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err) return res.status(500).send({ error: err })
        if (!user) return res.status(404).send({
            error: {
                code: 404,
                message: 'User not found'
            }
        });
        if (!user.validPassword(password)) return res.status(401).send({
            error: {
                code: 401,
                message: 'Invalid password'
            }
        })
        res.status(200).send({
            message: 'Succes',
            displayName: user.displayName,
            email: user.email,
            token: tokenSrv.createToken(user)
        })
    })
}

function validateToken(req, res) {
    const { user } = req;
    User.findById(user, (err, user) => {
        if (!user)
            return res.status(500).send({
                error: 500,
                message: 'User not found'
            })
        const { displayName, email } = user;
        res.status(200).send({
            message: 'Tienes acceso', user: {
                displayName,
                email
            }
        });
    })
}

function checkNewMonth(userId: string, pickDate: number) {
    const deferred = new Promise((resolve, reject) => {
        User.findById(userId, (err, user) => {
            const { statsByMonths } = user;
            const date = new Date(pickDate);
            const monthId = new Date(date.getFullYear(), date.getMonth()).getTime();
            const key = statsByMonths.findIndex((month) => {
                return month.id == monthId;
            })
            if (key < 0) {
                user.statsByMonths.push({ id: monthId });
                User.findByIdAndUpdate(user._id, user, (err, user) => {
                    if (err) throw new Error(err);
                })
            }
            resolve();
        })
    })
    return deferred;
}

export {
    signIn,
    signUp,
    validateToken,
    checkNewMonth
};