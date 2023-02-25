const Quiz = require('../../models/quizSchema').quizModel;

async function  joinGame(req, res)
{
    const {gamePin} = req.body;
    try
    {
        const quiz = await Quiz.findOne({gamePin});

        if(!quiz)
        {
            return res.status(400).json({
                    success: false,
                    message: "Quiz not found"
                });
        }

        res.json({
            success: true,
            quiz
        });
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

module.exports = {joinGame};