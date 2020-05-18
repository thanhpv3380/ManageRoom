const express = require('express');
// const upload = require('../handlers/multer');

const router = express.Router();

const userController = require('./../controllers/user.controller');

router.get('/', userController.index);
router.get('/list', userController.list);
router.get('/updateWork', userController.updateWork);
router.get('/history/:date', userController.history);
router.post('/update', userController.update);
module.exports = router;