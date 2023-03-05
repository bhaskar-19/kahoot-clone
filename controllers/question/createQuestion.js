const Question = require('../../models/quizSchema').questionModel;
const Quiz = require('../../models/quizSchema').quizModel;
const Option = require('../../models/quizSchema').optionModel;

async function saveQuestionsAndOptionsToDb(title,quiz, options)
{

    let correctOption = null;
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
        throw new Error("Whoops!");
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
    await quiz.save();
    return true;
}

async function createQuestion(req, res)
{
    try
    {
        const {title, options} = req.body;

        const quizId = req.params.quizId;
        const quiz = await Quiz.findById(quizId);
        if(!quiz)
        {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
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
        saveQuestionsAndOptionsToDb(title,quiz, options)
        .then((updatedQuiz)=>{
            res.status(201).json({
                success: true,
                message: 'Quiz created successfully',
                quiz
            });
        })
        .catch((error)=>{
            res.status(400).json({
                success: false,
                message: 'please choose any one as a correct option'
            });
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

module.exports = {createQuestion};