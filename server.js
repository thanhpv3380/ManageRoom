const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const schedule = require('node-schedule');
const moment = require('moment');

const sendMail = require('./handlers/sendMail');
const cors = require('cors');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 9000;

//config env
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser("secret"));

// connection db
mongoose.connect(process.env.MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true}).then(db => console.log('DB is Connected'));

app.get('/', async (req, res) => {

    res.send("HELLO");
});
//middleware
const authMiddleware = require('./middleware/auth.middleware');

//routes
const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/users.route');
const notificationRoute = require('./routes/notification.route');

app.use(authRoute);
app.use('/notifications', authMiddleware.auth, notificationRoute);
app.use('/users', authMiddleware.auth, userRoute);

const User = require('./models/users.model');
const Work = require('./models/works.model');

// const notifiEmail = async () => {
//     var j = schedule.scheduleJob('0 0 20 * * *', async function() {
//         const works = await Work.find();
//         const today = new Date();
//         let check = true;
//         for (let work of works){
//             if (moment(new Date(work.date)).format("MMM Do YY") === moment(today).format("MMM Do YY")){
//                 check = false;
//             }
//         }
//         //console.log(check);
//         if (check){
//             const users = await User.find();
//             for (let user of users) {
//                 if (user.email) {
//                     sendMail(user.email, '[Thông báo phòng 104]', '<strong>Test</strong>');
//                 }
//             }
//         }
//     });
// }
// notifiEmail();

function randomPos(choice){
    let minX = 0;
    let minY = 0;
    if (choice > 3){
        minX = (choice-4)*250;
        minY = 250;
    } else {
        minX = (choice-1)*250;
        minY = 0;
    }
    let x = Math.floor(Math.random() * 150) + (minX);
    let y = Math.floor(Math.random() * 150) + (minY);
    let rad = Math.floor(Math.random() * 360);
    return {x, y, rad};
}
let bets = [];
let players = [];
// {userId, coins, }
io.on('connection', (socket) => {
    console.log('connection ' + socket.id);
    socket.on('client-send-info', async (data) =>{
        socket.userId = data.userId;
        const user = await User.findOne({_id: data.userId});        
        players.push(
            {
                user: user,
                coin: user.coin
            }
        );
        socket.emit('client-send-allbets', {bets, players});
    });
    socket.on('client-send-bet', async (data) =>{
        const choice = data.choice;
        const user = await User.findOne({_id: data.userId});
        //console.log(user);
        if (user){
            let posBet = randomPos(choice);
            res = {
                user,
                choice,
                posBet
            }
            bets.push(res);
            io.sockets.emit('server-send-bet', res);
        }
    });

    socket.on('client-send-roll', () =>{
        let one = Math.floor(Math.random() * 6);
        let two = Math.floor(Math.random() * 6);
        let three = Math.floor(Math.random() * 6);
        console.log(one, two, three);
        for (let bet of bets){
            let point = 0;
            const user = bet.user;
            const userId = user._id;
            //console.log("choice: ",bet.choice);
            if (bet.choice === one+1) point++;
            if (bet.choice === two+1) point++;
            if (bet.choice === three+1) point++;
            //console.log(point);
            for (let i in players){
                let id = players[i].user._id;
                if (JSON.stringify(id) == JSON.stringify(userId)){
                    //console.log(id);
                    let coin = players[i].coin;
                    //console.log(coin);
                    coin -= 5;
                    coin += point * 10;
                    //console.log(coin);
                    players[i] = {...players[i], coin};
                    break;
                } 
            }    
        }
        console.log(players);
        bets = [];
        io.sockets.emit('server-send-roll', {one, two, three, players});
    });
    socket.on('client-send-open', () =>{
        io.sockets.emit('server-send-open');
    });
    socket.on('client-send-close', () =>{
        io.sockets.emit('server-send-close');
    });
    socket.on('disconnect', async () => {
        console.log('disconnect ' + socket.id);
        for (let i in players){
            if (JSON.stringify(players[i].user._id) == JSON.stringify(socket.userId)){
                let coin = players[i].coin;
                if (players[i].coin >= 999999) coin = 999999;
                const rs = await User.updateOne({_id: socket.userId}, {coin});
                
                players.splice(i, 1);

                break;
            }
        }
        console.log(players);

        socket.emit('server-send-disconnect', {players});
    });

});
// async function test(){
//     const rs = await User.updateMany({}, {coin: 100});
// }
// test();
server.listen(port, () => console.log('Server start at port 3000'));