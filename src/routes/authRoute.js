const router = require('express').Router();
const authController = require('./../controllers/authController.v1')

router.post('/signin', authController.signin);

module.exports = router;