const Quiz = require('../../models/quizSchema').quizModel;
const Option = require('../../models/quizSchema').optionModel;
const Question = require('../../models/quizSchema').questionModel;

async function saveQuestionsAndOptionsToDb(quiz, questions)
{

    // Iterate over questions and store Options maped with a question
    for(let i=0; i<questions.length; i++)
    {
        const {title, options} = questions[i];
        let correctOption;
        const questionOptions =[]; // storing a options for each question
        for(let j=0; j<options.length; j++)
        {
            const option = new Option({
                title: options[j].title,
                isCorrect: options[j].isCorrect,
                question: null
            });
            if(options[j].isCorrect)
            {
                correctOption = j;
            }
            await option.save();
            questionOptions.push(option);
        }
        if(correctOption === undefined|| correctOption === null)
        {
            return false;
        }
        // Create new question
        const question = new Question({
            title,
            options: questionOptions,
            correctOption: questionOptions[correctOption]._id,
            quiz: quiz._id
        });
        
        // Set question field for each option and save question to database
        for(let k=0; k<questionOptions.length; k++)
        {
            questionOptions[k].question = question._id;
            await questionOptions[k].save();
        }
        await question.save();
        quiz.questions.push(question._id);
    }
    await quiz.save();
    return true;
}

async function createQuiz(req, res)
{
    try
    {
        const quiz = new Quiz({
                                title: req.body.title,
                                discription: req.body.discription,
                                creator: req.body.creator,
                                gamePin: req.body.gamePin
                            });

        await quiz.save();
        const questions = req.body.questions;

        //Save questions and options to database and add to quiz
        if(saveQuestionsAndOptionsToDb(quiz, questions))
        {
            res.status(201).json({
                success: true,
                message: 'Quiz created successfully',
                quiz
            });
        }
        else
        {
            res.status(400).json({
                success: false,
                message: 'please choose any one as a correct option'
            });
        }
    }
    catch (error) 
    {
        console.error(error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
    }
}

module.exports = {createQuiz};