const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const schedule = require('node-schedule');
const moment = require('moment');

const sendMail = require('./handlers/sendMail');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 9000;



//config env
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser("secret"));

// connection db
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }).then(db => console.log('DB is Connected'));

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
const notifiEmail = async () => {
    var j = schedule.scheduleJob('0 0 20 * * *', async function() {
        const works = await Work.find();
        const today = new Date();
        let check = true;
        for (let work of works){
            if (moment(work.date).format("MMM Do YY") === moment(today).format("MMM Do YY")){
                check = false;
            }
        }
        //console.log(check);
        if (check){
            const users = await User.find();
            for (let user of users) {
                if (user.email) {
                    sendMail(user.email, '[Thông báo phòng 104]', '<strong>Test</strong>');
                }
            }
        }
    });
}
notifiEmail();


// const User = require('./models/users.model');
// const addUser = async () =>{
//     const name = ['Nguyễn Văn Đức', 'Đoàn Trọng Nghĩa',  'Vũ Ngọc Trường', 'Phạm Văn Thao', 'Nguyễn Văn Cường', 'Lê Bình Minh',  'Vũ Đức Long', 'Tạ Văn Đức', 'Phạm Huy Duy', 'Phạm Xuân Điều'];
//     const address = ['Quảng Xương - Thanh Hóa', 'Tiên Lữ - Hưng Yên', 'Hàn Thuyên - Bắc Ninh', 'Lương Sơn Bạc - Hòa Bình', 'Ninh Hòa - Khánh Hòa', 'Lê Trân - Hải Phòng', 'TP Thanh Hóa', 'Hà Nội', 'Đông Hưng - Thái Bình', 'An Lão - Hải Phòng'];
//     //const password = [];
//     for (let i = 0; i < 10; i++){
//         const user = {
//             name : name[i],
//             email : 'test@gmail.com',
//             password : '2017xxxx',
//             phone : 'xxxxx',
//             address : address[i],
//             image : 'https://res.cloudinary.com/dfbongzx0/image/upload/v1587393070/17241-200_sjxojm.png',
//             dob : '12/11/1999'
//         }
//         console.log(user);
//         const rs =  await User.create(user);
//     }
// } 
// addUser();
app.listen(port, () => console.log('Server start at port 3000'));