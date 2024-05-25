const express = require("express");
const { authenticateWithUsernameAndPassword, initiateSignUpSequence, verifySignUpCode, setNewPassword } = require("../controllers/users.signin.controller");
const { authenticateAdminLogin, verifyEmail, verifyCode, setNewAdminPassword } = require("../controllers/admins.signin.controller");
const router = express.Router();

router.post('/users/login', authenticateWithUsernameAndPassword);

// signup sequence
router.post('/users/signup/initiate', initiateSignUpSequence);
router.post('/users/signup/verify-code', verifySignUpCode);
router.post('/users/signup/set-password', setNewPassword);



router.post('admins/login', authenticateAdminLogin);

// admin signup and sign in
router.post('/admins/signup/initiate', verifyEmail);
router.post('/admins/signup/verify-code', verifyCode);
router.post('/admins/signup/set-password', setNewAdminPassword);


module.exports = router;