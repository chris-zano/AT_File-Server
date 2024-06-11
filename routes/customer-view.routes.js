const express = require("express");
const { renderGettinStartedPage, renderSigninPage, renderStoreForUsers, renderPasswordResetPage } = require("../controllers/view.controller");
const usersVerifyUtils = require("../utils/users.verify.utils");
const router = express.Router();

//customer views
router.get('/', renderGettinStartedPage);
router.get('/signin', renderSigninPage);
router.get('/store', usersVerifyUtils.verifyUserbyId, renderStoreForUsers);
router.get('/recovery', (req,res) => res.render("accounts/forgot-password.ejs", {error: "empty"}));

module.exports = router;