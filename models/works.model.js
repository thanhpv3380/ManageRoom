const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const workSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: false
    },
    date: {
        type: Date,
        require: false
    },
    image: {
        type: String,
        required: false
    }

});
const Work = mongoose.model('works', workSchema);
module.exports = Work;  