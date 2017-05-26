import * as Pick from '../models/pick';
import * as User from '../models/user';
import { Types } from 'mongoose';

const { ObjectId } = Types;

function initMocks() {
    Pick.find({}, (err, picks) => {
        if (picks.length === 0) {
            const mockPicks = require('./mocks/picks');
            Pick.create(mockPicks, err => {
                if (err) throw err
                verifyUsers();
            })
        } else {
            verifyUsers();
        }
    })
}

function verifyUsers() {
    User.find({}, (err, users) => {
        if (users.length === 0) {
            const mockUsers = require('./mocks/users');

            mockUsers.forEach(mockUser => {
                mockUser._id = new ObjectId(mockUser._id);
                createUser(mockUser)
                    .then(newData => {
                        mockUser = Object.assign({}, mockUser, newData);
                        const user = new User(mockUser);
                        user.save(err => {
                            if (err) throw err
                        })
                    })
            })
        }
    })
}

function createUser(user) {
    const deferred = new Promise((resolve, reject) => {
        Pick.find({ author: user._id }, (err, picks) => {
            let months = [];
            picks.forEach(pick => {
                const { result, stake, odd, date } = pick;
                const monthId = createMonthId(date);
                const key = months.findIndex(month => {
                    return month.id == monthId;
                })

                if (key > -1) {
                    let { winPicks, lostPicks, voidPicks, profits, totalStake, totalOdd } = months[key];
                    const resultObj = calculateWinLostVoid({ winPicks, lostPicks, voidPicks }, result);

                    profits += calculateProfit(result, stake, odd);
                    totalStake += stake;
                    totalOdd += odd;

                    months[key] = Object.assign({}, months[key], {
                        winPicks: resultObj.winPicks,
                        lostPicks: resultObj.lostPicks,
                        voidPicks: resultObj.voidPicks,
                        profits,
                        totalStake,
                        totalOdd
                    })
                } else {
                    const { winPicks, lostPicks, voidPicks } =
                        calculateWinLostVoid({ winPicks: 0, lostPicks: 0, voidPicks: 0 }, result);

                    months.push({
                        id: monthId,
                        winPicks,
                        lostPicks,
                        voidPicks,
                        totalOdd: odd,
                        totalStake: stake,
                        profits: calculateProfit(result, stake, odd)
                    })
                }
            })
            resolve({
                statsByMonths: months
            })
        })
    })
    return deferred;
}

function calculateProfit(result, stake, odd) {
    return (result === 'W' ? stake * odd - stake : (result === 'L' ? - stake : 0));
}

function calculateWinLostVoid(obj, result) {
    let { winPicks, lostPicks, voidPicks } = obj;
    winPicks = result == 'W' ? winPicks + 1 : winPicks;
    lostPicks = result == 'L' ? lostPicks + 1 : lostPicks;
    voidPicks = result == 'V' ? voidPicks + 1 : voidPicks;

    return { winPicks, lostPicks, voidPicks }
}

function createMonthId(time) {
    const date = new Date(time);
    const dateId = new Date(date.getFullYear(), date.getMonth());

    return dateId.getTime();
}

export {
    initMocks
}