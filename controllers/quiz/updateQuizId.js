const Quiz = require('../../models/quizSchema').quizModel;
const Question = require('../../models/quizSchema').questionModel;
const Option = require('../../models/quizSchema').optionModel;

async function updateQuestionAndOptions(quiz, questions)
{
    quiz.questions = [];
    // Save the updated questions and options to the database
    for (let i = 0; i < questions.length; i++){
        const { title, options } = questions[i];
        const question = new Question({ title });
        question.quiz = quiz._id;

        const savedQuestion = await question.save();

        for (let j = 0; j < options.length; j++) {
            const { title, isCorrect } = options[j];
            const option = new Option({ title, isCorrect });
            option.question = savedQuestion._id;
            await option.save();
        }

        quiz.questions.push(savedQuestion._id);
    }
  
    // Save the updated quiz to the database
    const updatedQuiz = await quiz.save();
    return updatedQuiz;
}

async function updateQuizById(req, res)
{
    try
    {
        const {id } = req.params;
        const userId = req.body.creator;
        const quiz = await Quiz.findById(id);

        if(!quiz)
        {
            return res.status(400).json({
                success: false,
                message: "Quiz not found"
            });
        }

        if(!quiz.creator.equals(userId))
        {
            return res.status(403).json({ 
                        success:false,
                        message: 'Not authorized to update this quiz' 
                    });
        }
        //save question and option into the db
        const {title, questions} = req.body;
        quiz.title = title;
        // Delete existing questions and options
        await Question.deleteMany({ quiz: id });
        const delquestions = quiz.questions;
        for(let i=0; i<delquestions.length; i++)
        {
            let questionId = delquestions[i]._id;
            await Option.deleteMany({question: questionId});
        }
        
        updatedQuiz = updateQuestionAndOptions(quiz, questions);
        res.status(200).json({
            success: true,
            updatedQuiz
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

module.exports = {updateQuizById};