const jwt = require('jsonwebtoken');
const User = require('../models/userSchema').userModel;
const Quiz = require('../models/quizSchema').quizModel;

const requireAuth = async (req, res, next) => {
    try 
    {
        const token = req.header('jwttoken');
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const decodedToken = jwt.verify(token, process.env.JWTSECRETEKEY);
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(400).json({ error: 'Unauthorized' });
        }

        if(req.method === 'DELETE' || req.method === 'PUT')
        {
            const quiz = await Quiz.findOne({_id:req.params.quizId,creator: user._id});
            if(!quiz)
            {
                return res.status(400).json({error: 'Quiz not found in your quizzes'});
            }
        }
        next();
    } 
    catch(err) 
    {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};


module.exports = { requireAuth };
