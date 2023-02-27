const Question = require('../../models/quizSchema').questionModel;
async function getQuestionById(req, res)
{
    try
    {
        const question = await Question.findOne({ _id: req.params.questionId, quiz: req.params.quizId }).populate('options');
        if (!question) {
            return res.status(404).json({ 
                success: false,
                message: 'Question not found' });
        }
        res.status(200).json({
                success: true,
                question
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

module.exports = {getQuestionById};