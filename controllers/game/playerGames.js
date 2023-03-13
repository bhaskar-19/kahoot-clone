const mongoose = require('mongoose');

const Games = require('../../models/gameSchema').Game;


async function playerGames(req, res)
{
    try
    {
        const {playerId} = req.params;

        const games = await Games.aggregate([
            {$unwind: '$games'},
            {$unwind: '$games.players'},
            {
                $match: {'games.players.playerId': new mongoose.Types.ObjectId(playerId)}
            },
            {
                $lookup: {
                    from: 'quizzes',
                    localField: 'quiz',
                    foreignField: '_id',
                    as: 'quiz'
                  }
            },
            {
                $project:{
                    batch:'$games.batch',
                    score:'$games.players.score',
                    quiz: '$quiz.title',
                    batchId: '$games._id'

                }
            }
        ]);

        if(!games)
        {
            return res.status(404).json({
                success: false,
                message : "Games Not found"
            });
        }

        res.status(200).json({
            success: true,
            games: games
        });
    }
    catch(error)
    {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Internel server error"
        });
    }
}

module.exports = {playerGames}