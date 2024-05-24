const express = require("express");
const { authenticateWithUsernameAndPassword } = require("../controllers/signin.controller");
const router = express.Router();

router.post('/users/signin/sign-in-with-username-and-password', authenticateWithUsernameAndPassword);
router.post('/users/signin/sign-up-with-email')


module.exports = router