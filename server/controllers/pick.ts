import * as Pick from '../models/pick';
import * as User from '../models/user';

function getUserStats(req, res) {
    const userId = req.user;

    User.findById(userId, (err, picks) => {
        if (err) return res.status(500).send({
            error: err
        });

        res.status(200).send({ 
            payload: picks.statsByMonths
        });
    });
}

export {
    getUserStats,
}