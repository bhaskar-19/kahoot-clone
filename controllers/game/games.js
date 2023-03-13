const Games = require('../../models/gameSchema').Game;
const mongoose = require('mongoose');

async function games(req, res) {
    try {
        const { creator } = req.params;
        const game = await Games.find({ host: creator }, { quiz: 1, createdAt: 1, len: { $size: "$games" } }).populate({
            path: 'quiz',
            select: 'title'
        });
        if (!game) {
            return res.status(404).json({
                success: false,
                message: "No games hosted"
            })
        }
        res.status(200).send(game);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Internal server error"
        })
    }
}


async function gameQuizData(req, res) {
    try {
        const { quizId } = req.params;

        const games = await Games.findOne({ quiz: quizId }, { games: 1 });

        if (!games) {
            return res.status(404).json({
                success: false,
                message: "Games not found"
            })
        }

        res.status(200).json({
            success: true,
            games
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Internel server error"
        })
    }
}

async function gamePlayersData(req, res) {
    try {
        const { quizId, gameId } = req.params;
        const gameData = await Games.aggregate([
            {
                $match: {
                    quiz: new mongoose.Types.ObjectId(quizId)
                }
            },
            {
                $unwind: '$games'
            },
            {
                $match:{
                    'games._id' : new mongoose.Types.ObjectId(gameId)   
                }
            },
            {
                $project:{
                    games:'$games'
                }
            },
            {$unwind: '$games.players'},
            {
                $sort: {'games.players.score': -1}
            }
        ]);
        if (!gameData) {
            return res.status(404).json({
                success: false,
                message: "Game not found"
            });
        }
        res.status(200).json({
            success: true,
            gameData
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = { games, gameQuizData, gamePlayersData };


