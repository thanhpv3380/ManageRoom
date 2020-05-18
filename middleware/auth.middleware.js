const jwt = require('jsonwebtoken');

module.exports.auth = async (req, res, next) => {
    const bearer = req.headers["authorization"];
    //console.log(bearer);
    if (bearer){
        jwt.verify(bearer, process.env.SECRET_KEY, function(error, data){
            if (error){
                res.sendStatus(403);
            } else {
                //console.log(data);
                req.body.userId = data._id;
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
}
    