const Quiz = require('../../models/quizSchema').quizModel;
const Question = require('../../models/quizSchema').questionModel;
const Option = require('../../models/quizSchema').optionModel;

async function deleteQuestionById(req, res)
{
    try
    {
        const questionId = req.params.questionId;
        const quizId = req.params.quizId;
        //Checking a quiz is exists or not
        const quiz = await Quiz.findById(quizId);
        if(!quiz)
        {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            })
        }

        //Checking a question is exists or not
        const question = await Question.findOne({_id: questionId, quiz: quizId});
        
        if(!question)
        {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            })
        }

        //Verifying a user is whether authorized or not to update question
        const userId = req.get('userId');
        if(!quiz.creator.equals(userId))
        {
            return res.status(403).json({ 
                        success:false,
                        message: 'Not authorized to update this Question' 
                    });
        }

        await quiz.questions.pull(questionId);
        await Question.deleteOne({_id: questionId});
        await Option.deleteMany({question: questionId});
        await quiz.save();
        
        res.send(true);
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

module.exports = {deleteQuestionById};