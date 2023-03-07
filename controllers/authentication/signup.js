const User = require('../../models/userSchema').userModel;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../../.env'});

const jwtKey = process.env.JWTSECRETEKEY;

async function signup(req, res){
    try
    {
        
        const {firstName, lastName, email, password, role} = req.body;
    
        //Validate User input
        if(!firstName || !lastName || !email || !password || !role)
        {
            return res.status(400).send('Please fill all required fields');
        }

        //Check for existing User (i.e email is already registered or not)
        const existUser = await User.findOne({email: email});
        if(existUser)
        {
            return res.status(400).send('Email address is already registered');
        }

        //Hash the password to increase security
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create a new user
        const user = User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            role: role
        });

        //saving a user into db
        await user.save();

        //Generation of jwt token for authorization purpose
        
        let data = {
            time: Date(),
            email: email
        }
        const token = jwt.sign(data, jwtKey);
        res.status(200).json({
            success: true,
            message: 'Registerd successfully',
            token
        });
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

module.exports = {signup}