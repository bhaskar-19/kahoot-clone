const jwt = require('jsonwebtoken');
const User = require('../models/userSchema').userModel;
const GoogleUser = require('../models/googleUsersSchema').GoogleUser;

const validate = async (req, res, next) => {
    try {
        const token = req.header('jwttoken');
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const decodedToken = jwt.verify(token, process.env.JWTSECRETEKEY);
        const user = await User.findById(decodedToken.id);
        const googleUser = await GoogleUser.findById(decodedToken.id);
        if (!user && !googleUser) {
            return res.status(400).json({ error: 'Unauthorized' });
        }
        if (user) {
            return res.status(200).json({
                success: true,
                role: user.role
            });
        }
        return res.status(200).json({
            success: true,
            role: googleUser.role
        });


    }
    catch (err) {
        return res.status(400).json({ error: 'Unauthorized' });
    }
};


module.exports = { validate };
