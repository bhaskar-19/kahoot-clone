const mongoose = require('mongoose');

const Games = require('../../models/gameSchema').Game;

async function batchLeaderBoard(req, res)
{
    try
    {
        const {batchId} = req.params;
        const batchData  = await Games.aggregate([
            {
                $unwind: '$games'
            },
            {
                $unwind: '$games.players'
            },
            {
                $match: {
                    'games._id' : new mongoose.Types.ObjectId(batchId)
                }
            },
            {
                $project:{
                    name : '$games.players.name',
                    score : '$games.players.score'
                }
            }
        ]);
        if(!batchData)
        {
            return res.status(404).json({
                success: false,
                message: "Internal Server Error"
            });
        }

        res.status(200).json({
            success: true,
            batch: batchData
        }); 
    }
    catch(error)
    {
        console.log(error);
        res.status(404).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = {batchLeaderBoard};