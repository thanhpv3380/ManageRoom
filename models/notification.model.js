const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const notificationSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: false
    },
    date: {
        type: Date,
        require: false
    },
    title: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: false
    }

});
const Notification = mongoose.model('notifications', notificationSchema);
module.exports = Notification;  