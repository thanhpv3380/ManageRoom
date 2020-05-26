const Notification = require('./../models/notification.model');
const User = require('./../models/users.model');

//send Email
const sendMail = require('../handlers/sendMail');

module.exports.getList = async (req, res) => {
    //console.log('fds');
    const notifications = await Notification.find();
    //console.log(notificaitons);
    let notificationsTemp = [];
    for (let notification of notifications) {
        const userId = notification.userId;
        let user = await User.findOne({ _id: userId });

        //console.log(user);
        //notification.user = user;

        notificationsTemp.push({ notification, user });
    }
    // //console.log(notificationsTemp);

    res.json({ success: true, notifications: notificationsTemp });
}
module.exports.send = async (req, res) => {
    const userId = req.body.userId;

    const users = await User.find();
    for (let user of users) {
        if (user.email) {
            sendMail(user.email, req.body.title, `<strong>${req.body.content}</strong>`);
        }
    }
    const rs = await Notification.create({userId, date: new Date(), title: req.body.title, content: req.body.content});

    if (rs) {
        res.json({success : true, rs});
    } else {
        res.json({success: false});
    }


}