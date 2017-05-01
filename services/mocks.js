'use strict'

const Pick = require('../models/pick');

function initMocks() {
    Pick.find({}, (err, picks) => {
        if (picks.length === 0) {
            const mockPicks = require('./mocks/picks');
            Pick.create(mockPicks, err => {
                if (err) throw err
            })
        }
    })
}

module.exports = {
    initMocks
}