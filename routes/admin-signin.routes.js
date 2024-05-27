const express = require("express");
const { authenticateAdminLogin, verifyEmail, verifyCode, setNewAdminPassword } = require("../controllers/admins.signin.controller");
const router = express.Router();

router.post('admins/login', authenticateAdminLogin);

// admin signup and sign in
router.post('/admins/signup/initiate', verifyEmail);
router.post('/admins/signup/verify-code', verifyCode);
router.post('/admins/signup/set-password', setNewAdminPassword);


module.exports = router;