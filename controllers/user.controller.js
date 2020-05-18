const User = require('./../models/users.model');
const Work = require('./../models/works.model');
const cloudinary = require("cloudinary").v2;
const multer = require('multer');
const moment = require('moment');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
module.exports.index = async (req, res) => {
    const userId = req.body.userId;

    const user = await User.findOne({ _id: userId });
    //console.log(user);
    if (user) {
        res.json({ success: true, user });
    } else {
        res.json({ success: false });
    }
}
module.exports.list = async (req, res) => {
    const userId = req.body.userId;

    const users = await User.find({});
    //console.log(user);
    if (users.length > 0) {
        res.json({ success: true, users });
    } else {
        res.json({ success: false });
    }
}
module.exports.update = async (req, res) => {
    const userId = req.body.userId;
    // const dob = req.body.dob;
    // const email = req.body.email;
    // const phone = req.body.phone;
    let image = '';
    var storage = multer.diskStorage({});
    var upload = multer({ storage: storage }).single('image');
    //console.log(req);
    upload(req, res, async (err) =>{
        if (err){
            res.json({success: false})
        } else {
            //console.log(req);
            const result = await cloudinary.uploader.upload(req.file.path);
            image = result.url;
            //userData.image = image;
            const rs = await User.updateOne({_id: userId}, {image});
            const user = await User.findOne({ _id: userId });
            res.json({success: true, user: user})
        }
    })
}
module.exports.history = async (req, res) => {
    const userId = req.body.userId;
    const date = req.params.date;
    //console.log(date);
    const works = await Work.find();
    let work = {};
    for (let i in works){
        if (moment(new Date(works[i].date)).format("MMM Do YY") === moment(new Date(date)).format("MMM Do YY")) {
            work = works[i];
            break;
        }
    }
    let user = null;
    //console.log(work);
    if (work){
        user = await User.findOne({_id: work.userId});
    }
    if (user) {
        res.json({ success: true, user, work});
    } else {
        res.json({ success: false });
    }
}
module.exports.updateWork = async (req, res) => {
    const userId = req.body.userId;
    
    const work = {
        userId: userId,
        date : new Date(),
        image: ''
    }
    const rs = Work.create(work);
    if (rs){
        res.json({success: true})
    } else {
        res.json({success: false})
    }
    
}