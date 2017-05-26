import * as tokenSrv from '../services/token';

function isAuth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'Usuario no autorizado' });
    }
    const token = req.headers.authorization.split(" ")[1];

    tokenSrv.decodeToken(token)
        .then(response => {
            req.user = response;
            next();
        })
        .catch(response => {
            res.status(response.code).send({
                error: response
            })
        })
}

export {
    isAuth
};