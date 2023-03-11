const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../../models/userSchema').userModel;
const jwtKey = process.env.JWTSECRETEKEY;

async function signin(req, res)
{
    try
    {
        const {email, password} = req.body;
        
        //find a user by email
        const user = await User.findOne({email});
        if(!user)
        {
            return res.status(400).send("Invalid email or password");
        }

        //compare password
        const passwordMateched = await bcrypt.compare(password, user.password);
        
        if(!passwordMateched)
        {
            return res.status(400).send("Invalid email or password");
        }

        //Generete a jwt token for authorization
        let data = {
            time: Date(),
            id: user._id
        }
        const token = jwt.sign(data, jwtKey);
        res.status(200).json({
            token,
            role: user.role,
            id: user._id,
            name: user.firstName
        });
    }
    catch (error) 
    {
        console.error(error);
        res.status(400).json({
          success: false,
          message: 'Internal server error'
        });
    }
}

module.exports = {signin};