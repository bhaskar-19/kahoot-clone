const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../../models/userSchema').userModel;
const jwtKey = process.env.JWTSECRETEKEY;

async function signin(req, res)
{
    const {email, password} = req.body;

    //find a user by email
    const user = await User.findOne({email});
    if(!user)
    {
        res.status(400).send("Invalid email or password");
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
        email: email
    }
    const token = jwt.sign(data, jwtKey);
    res.send(token);
}

module.exports = {signin};