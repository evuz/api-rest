import { Pick } from '../models/pick';
import { User } from '../models/user';
import * as UserCtrl from './user';

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

function getUserPicks(req, res) {
    const userId = req.user;
    const monthId = new Date(parseInt(req.params.idMonth));
    const initDate = new Date(monthId.getFullYear(), monthId.getMonth()).getTime();
    const endDate = new Date(monthId.getFullYear(), monthId.getMonth() + 1).getTime();

    Pick.find({
        author: userId,
        date: { $gte: initDate, $lt: endDate }
    }, (err, picks) => {
        if (err) throw err;
        res.status(200).send({
            payload: picks
        })
    });
}

function addPick(req, res) {
    const { body } = req;
    const userId = req.user;
    const pick = new Pick({
        author: userId,
        date: body.date || Date.now(),
        sport: body.sport,
        competition: body.competition,
        match: body.match,
        pick: body.pick,
        tipster: body.tipster,
        stake: body.stake,
        odd: body.odd,
        bookie: body.bookie
    })
    pick.save((err, pick) => {
        if (err) throw new Error(err);
        UserCtrl.checkNewMonth(pick.author, pick.date.getTime())
            .then(() => res.status(200).send({
                message: 'Success'
            }))
    })
}

function deletePick(req, res) {
    const { params: { idPick }, user } = req;
    Pick.findById(idPick, (err, pick) => {
        if (err) return res.status(500).send({
            error: 500,
            message: err,
        });
        if (pick.author === user) {
            pick.remove(err => {
                if (err) res.status(500).send({
                    error: 500,
                    message: err,
                })
            })
        } else {
            return res.status(404).send({
                error: 404,
                message: 'User not authorized'
            });
        }
    });
}

export {
    getUserStats,
    getUserPicks,
    addPick,
    deletePick
}