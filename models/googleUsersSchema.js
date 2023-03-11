const mongoose = require('mongoose');

const googleUserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required : true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        enum: ['teacher', 'student'],
        default: 'student'
    }
});

const GoogleUser = mongoose.model('GoogleUser',googleUserSchema)

module.exports = {GoogleUser};