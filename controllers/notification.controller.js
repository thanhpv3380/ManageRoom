const Notification = require('./../models/notification.model');
const User = require('./../models/users.model');
module.exports.getList = async (req, res) =>{
    //console.log('fds');
    const notifications = await Notification.find();
    //console.log(notificaitons);
    let notificationsTemp = [];
    for (let notification of notifications){
        const userId = notification.userId;
        let user = await User.findOne({_id: userId});

        //console.log(user);
        //notification.user = user;
        
        notificationsTemp.push({notification, user});
    }
    // //console.log(notificationsTemp);
    
    res.json({success: true, notifications: notificationsTemp});
}