const jwt = require('jsonwebtoken');
const User = require('../models/userSchema').userModel;

const requireAuth = async (req, res, next) => {
    try 
    {
        const token = req.header('jwttoken');
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const decodedToken = jwt.verify(token, process.env.JWTSECRETEKEY);
        const user = await User.findOne({email:decodedToken.email}).count();
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        next();
    } 
    catch(err) 
    {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = { requireAuth };
