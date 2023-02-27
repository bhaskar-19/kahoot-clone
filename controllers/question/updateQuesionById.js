const Question = require('../../models/quizSchema').questionModel;
const Quiz = require('../../models/quizSchema').quizModel;
const Option = require('../../models/quizSchema').optionModel;
async function updateQuestionById(req, res)
{
    try
    {
        //Checking a quiz is exists or not
        const quiz = await Quiz.findById(req.params.quizId);
        if(!quiz)
        {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            })
        }

        //Checking a question is exists or not
        const question = await Question.findOne({_id: req.params.questionId, quiz: req.params.quizId});
        
        if(!question)
        {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            })
        }

        //Verifying a user is whether authorized or not to update question
        const userId = req.body.creator;
        if(!quiz.creator.equals(userId))
        {
            return res.status(403).json({ 
                        success:false,
                        message: 'Not authorized to update this Question' 
                    });
        }
        const {title, options} = req.body;  
        if(title)
        {
            question.title = title;
        }

        let cid;
        // Update the options if provided
        if (options) 
        {
            question.options = [];
            await Option.deleteMany({question: question._id});
            const optionIds = [];
            for(const option of options)
            {
                const optionData = Option({
                    title : option.title,
                    isCorrect : option.isCorrect,
                    question : question._id
                });
                const dbOption = await optionData.save();
                if(option.isCorrect)
                {
                    cid = dbOption._id;
                }
                optionIds.push(dbOption._id);
            }
            question.options = optionIds;
            question.correctOption = cid;
        }
        await question.save();
        
        res.json(question);

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

module.exports = {updateQuestionById};