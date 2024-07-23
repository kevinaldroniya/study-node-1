const router = require('express').Router();
const roleController = require('./../controllers/roleController.v1');
const validateToken = require('./../middleware/auth');

router.get('/roles', validateToken.verifyToken, roleController.getAllRoles);
router.get('/roles/:id', validateToken.verifyToken, roleController.getRoleById);
router.get('/ass/:userId', roleController.assignRoletoUser);
module.exports = router;