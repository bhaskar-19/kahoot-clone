const { OAuth2Client } = require('google-auth-library');
const { google, GoogleApis } = require('googleapis');
const User = require('../../models/googleUsersSchema').GoogleUser;
const jwt = require('jsonwebtoken');



const clientID = process.env.CLIENTID
const clientSecret = process.env.CLIENTSECRETE
const jwtKey = process.env.JWTSECRETEKEY;

const oauth2Client = new google.auth.OAuth2(
    clientID,
    clientSecret,
    "http://18.222.118.35:80/authentication/auth/google/callback"
);

const scopes = ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"];

const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',

    // If you only need one scope you can pass it as a string
    scope: scopes
});


function googleSignin(req, res) {
    res.redirect(url);
}

async function googlCb(req, res) {
    try {
        const code = req.query.code;    // get the code from req, need to get access_token for the user 
        const { tokens } = await oauth2Client.getToken(code)    // get tokens
        // create new auth client
        oauth2Client.setCredentials({ access_token: tokens.access_token });    // use the new auth client with the access_token
        let oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });
        const { data } = await oauth2.userinfo.get();    // get user info

        const existUser = await User.findOne({ email: data.email });
        if (!existUser) {
            let user = new User({
                firstName: data.name,
                email: data.email
            });
            user = await user.save()
            let jwtData = {
                time: Date(),
                id: user._id
            }
            const token = jwt.sign(jwtData, jwtKey);
            res.cookie('userData', {
                success: true,
                token,
                id: user._id,
                name: user.firstName,
                role: ""
            });
            return res.redirect('/spinner.html');
        }
        else {
            let jwtData = {
                time: Date(),
                id: existUser._id
            }
            const token = jwt.sign(jwtData, jwtKey);
            res.cookie('userData', {
                success: true,
                token,
                id: existUser._id,
                name: existUser.firstName,
                role: existUser.role
            })
            res.redirect('/spinner.html');
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Intenal server error"
        });
    }
}

async function updateTeacher(req, res)
{
    try
    {
        const id = req.body.id;
        const user = await User.findById(id);
        if(!user)
        {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        user.role = 'teacher';
        const upuser = await user.save();
        res.status(200).json({
            success: true
        });
    }
    catch(error)
    {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = { googleSignin, googlCb, updateTeacher };