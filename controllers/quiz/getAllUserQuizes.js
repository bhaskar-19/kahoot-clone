const Quiz = require('../../models/quizSchema').quizModel;

async function getAllUserQuizes(req, res)
{
    const creator = req.params.creator;
    try
    {
        const quizzes = await Quiz.find({creator:creator}).populate('creator');
        res.status(200).json({
            success:true,
            quizzes
        })
    }
    catch(error)
    {
        console.error(error);
        res.status(400).json({
          success: false,
          message: 'Internal server error'
        });
    }
}

module.exports = {getAllUserQuizes}