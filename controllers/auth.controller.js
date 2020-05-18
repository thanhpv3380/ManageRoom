const jwt = require('jsonwebtoken');
const User = require('./../models/users.model');

module.exports.login = async (req, res) =>{
    let { password } = req.body;
    let user = await User.findOne({ password });
    //console.log(username, user);
    if (user){
        const payload = {
            _id: user._id
        };
        let token = jwt.sign(payload, process.env.SECRET_KEY);
        res.json({success: true, token});
    } else {
        res.json({success: false});
    }
}