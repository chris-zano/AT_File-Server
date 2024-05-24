const express = require("express");
const { authenticateWithUsernameAndPassword, initiateSignUpSequence, verifySignUpCode, setNewPassword } = require("../controllers/signin.controller");
const router = express.Router();

router.post('/users/login', authenticateWithUsernameAndPassword);

// signup sequence
router.post('/users/signup/initiate', initiateSignUpSequence);
router.post('/users/signup/verify-code', verifySignUpCode);
router.post('/users/signup/set-password', setNewPassword);


module.exports = router