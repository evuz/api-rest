import { Pick } from '../models/pick';
import { User } from '../models/user';

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

function getUserPicks (req, res) {
    const userId = req.user;
    const monthId = new Date(parseInt(req.params.idMonth));
    const initDate = new Date(monthId.getFullYear(), monthId.getMonth()).getTime();
    const endDate = new Date(monthId.getFullYear(), monthId.getMonth() + 1).getTime();
    
    Pick.find({
        author: userId,
        date: {$gte: initDate, $lt: endDate}
    }, (err, picks) => {
        if (err) throw err;
        res.status(200).send({
            payload: picks
        })
    });
}

export {
    getUserStats,
    getUserPicks
}