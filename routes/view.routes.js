const express = require("express");
const { renderGettinStartedPage, renderSigninPage, renderStoreForUsers } = require("../controllers/view.controller");
const usersVerifyUtils = require("../utils/users.verify.utils");
const router = express.Router();

router.get('/', renderGettinStartedPage);
router.get('/signin', renderSigninPage);
router.get('/store/user=:id', usersVerifyUtils.verifyUserbyId, renderStoreForUsers);

module.exports = router;