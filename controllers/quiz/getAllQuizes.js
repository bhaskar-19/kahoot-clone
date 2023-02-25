const Quiz = require('../../models/quizSchema').quizModel;

async function getAllQuizes(req, res)
{
    try
    {
        const quizzes = await Quiz.find({}).populate('creator');
        res.status(200).json({
            success:true,
            quizzes
        })
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
    }
}

module.exports = {getAllQuizes}