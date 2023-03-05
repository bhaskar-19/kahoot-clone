const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    pin: {
        type: String,
        required: true,
        unique: true
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    players: [{
        name: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            default: 0
        }
    }],
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['waiting', 'in_progress', 'ended'],
        default: 'waiting'
    },
    startedAt: {
        type: Date
    },
    endedAt: {
        type: Date
    }
}, 
{ timestamps: true }
);

const Game = mongoose.model('Game', gameSchema);

module.exports = {Game};
