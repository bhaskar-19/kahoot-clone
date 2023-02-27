const Question = require('../../models/quizSchema').questionModel;
const Quiz = require('../../models/quizSchema').quizModel;
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
        const question = await Question.findOne({_id: req.params.questionId, quiz: req.params.quizId}).populate('options');
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
            // Loop through the provided options
            for (const option of options) 
            {
                // Find the corresponding option in the database
                const dbOption = question.options.find(opt => opt._id);
                console.log(dbOption);
                // Update the option text and correct status if provided
                if (dbOption) 
                {
                    dbOption.title = option.title;
                    dbOption.isCorrect = option.isCorrect;
                    if(option.isCorrect)
                    {
                        cid = dbOption._id;
                    }
                    
                    // Save the updated option to the database
                    await dbOption.save();
                }
            }
        }
        question.correctOption = cid;
        // Save the updated question to the database
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