const express = require('express');
// const upload = require('../handlers/multer');

const router = express.Router();

const notificationController = require('./../controllers/notification.controller');

router.get('/getList', notificationController.getList);
router.post('/send', notificationController.send);
module.exports = router;