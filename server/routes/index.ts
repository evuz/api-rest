import * as express from 'express';
import * as PickCtrl from '../controllers/pick';
import * as UserCtrl from '../controllers/user';
import { isAuth } from '../middlewares/auth';
const api = express.Router();

api.get('/userstats', isAuth, PickCtrl.getUserStats);
api.post('/signup', UserCtrl.signUp);
api.post('/signin', UserCtrl.signIn);
api.get('/signin', isAuth, UserCtrl.validateToken);
api.get('/private', isAuth, function (req, res) {
    res.status(200).send({ message: 'Tienes acceso' });
});

export default api;