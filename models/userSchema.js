const mongoose = require('./connection').mongoose;

const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['teacher', 'student'],
        default: 'student'
    }
});
const userModel =  mongoose.model('User', userSchema);
module.exports = {userModel};