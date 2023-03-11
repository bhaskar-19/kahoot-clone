const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    games: [{
        batch:
        {
            type: String,
            required: true,
            unique: true
        },
        pin: 
        {
            type: Number,
            unique: true
        },
        players:[{
            playerId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            score: {
                type: Number,
                required: true
            }
    }]
}],
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
