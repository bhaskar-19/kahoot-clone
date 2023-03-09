const jwt = require('jsonwebtoken');
const User = require('../models/userSchema').userModel;


const validate = async (req, res, next) => {
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

        
        res.send(true);
    } 
    catch(err) 
    {
        return res.status(400).json({ error: 'Unauthorized' });
    }
};


module.exports = { validate };
