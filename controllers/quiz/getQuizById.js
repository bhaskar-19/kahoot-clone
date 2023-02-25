const Quiz = require('../../models/quizSchema').quizModel;

async function getQuizById(req, res)
{
    const { id } = req.params;
    try
    {
        const quiz = await Quiz.findById({_id:id}).populate('creator', '-password');

        if(!quiz)
        {
            res.status(400).json({
                success: false,
                message: 'Quiz not found'
            });
        }
         res.status(200).json({
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

module.exports = {getQuizById};