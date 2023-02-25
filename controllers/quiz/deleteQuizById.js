const Quiz = require('../../models/quizSchema').quizModel;
const Question = require('../../models/quizSchema').questionModel;
const Option = require('../../models/quizSchema').optionModel;

async function deleteQuizById(req, res)
{
    const {id} = req.params;
    try
    {
        // Find the quiz by ID in the database and delete it
        const quiz = await Quiz.findByIdAndDelete(id);

        const questions = quiz.questions;
        for(let i=0; i<questions.length; i++)
        {
            let questionId = questions[i]._id;
            await Option.deleteMany({question: questionId});
        }

        // Delete existing questions and options
        await Question.deleteMany({ quiz: id });

        if (!quiz) 
        {
        return res.status(400).json({ 
                success: false,
                message: 'Quiz not found' 
            });
        }

        res.json({ 
            success: true,
            message: 'Quiz deleted' 
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

module.exports = {deleteQuizById};