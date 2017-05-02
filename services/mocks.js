'use strict'

const Pick = require('../models/pick');
const User = require('../models/user');

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
        Pick.find({ author: user.displayName }, (err, picks) => {
            let totalPicks = 0;
            let totalProfit = 0;
            let avgStake = 0;
            let avgOdd = 0;
            let months = [];
            picks.forEach(pick => {
                const { result, stake, odd, date } = pick;
                const monthId = createMonthId(date);

                const key = months.findIndex(month => {
                    
                    return month.id == monthId;
                })
                if (key > -1) {
                    let { totalPicks, totalProfit, avgStake, avgOdd } = months[key];

                    totalProfit += calculateProfit(result, stake, odd);
                    avgStake = (avgStake * totalPicks + stake) / (totalPicks + 1);
                    avgOdd = (avgOdd * totalPicks + odd) / (totalPicks + 1);
                    totalPicks++;

                    months[key] = Object.assign({}, months[key], {
                        totalPicks,
                        totalProfit,
                        avgStake,
                        avgOdd
                    })
                } else {
                    months.push({
                        id: monthId,
                        totalPicks: 1,
                        avgOdd: odd,
                        avgStake: stake,
                        totalProfit: calculateProfit(result, stake, odd)
                    })
                }
                totalProfit += calculateProfit(result, stake, odd);
                avgStake = (avgStake * totalPicks + stake) / (totalPicks + 1);
                avgOdd = (avgOdd * totalPicks + odd) / (totalPicks + 1);
                totalPicks++;
            })
            resolve({
                avgOdd,
                avgStake,
                totalPicks,
                totalProfit,
                months
            })
        })
    })
    return deferred;
}

function calculateProfit(result, stake, odd) {
    return (result === 'W' ? stake * odd - stake : (result === 'L' ? - stake : 0));
}

function createMonthId(date) {
    const dateId = new Date(date);

    return dateId.getMonth() + 'm' + dateId.getFullYear() + 'y';
}

module.exports = {
    initMocks
}