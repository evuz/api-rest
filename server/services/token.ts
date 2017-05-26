import * as jwt from 'jwt-simple';
import * as moment from 'moment';
import config from '../config';

function createToken(user) {
    const payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    }

    return jwt.encode(payload, config.SECRET_TOKEN);
}

function decodeToken(token) {
    const decode = new Promise((resolve, reject) => {
        try {
            const payload = jwt.decode(token, config.SECRET_TOKEN)
            if (payload.exp <= moment().unix()) {
                reject({
                    message: 'Token expirado',
                    code: 401
                })
            }
            resolve(payload.sub)
        } catch (err) {
            reject({
                code: 500,
                message: 'Invalid Token'
            })
        }
    })
    return decode;
}

export {
    createToken,
    decodeToken
}