const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: false
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    dob: {
        type: Date,
        required: false
    }
});
const User = mongoose.model('users', userSchema);
module.exports = User;  