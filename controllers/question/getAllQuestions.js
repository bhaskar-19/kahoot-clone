const Quiz = require('../../models/quizSchema').quizModel;


async function getAllQuestions(req, res)
{
    try
    {
        const quiz = await Quiz.findById(req.params.quizId)
                                .populate({
                                    path: 'questions',
                                    populate: {
                                        path: 'options',
                                        select: 'title'
                                    }
                                });
        if(!quiz )
        {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }
        res.status(200).json({
            success: true,
            quiz
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

module.exports = {getAllQuestions};