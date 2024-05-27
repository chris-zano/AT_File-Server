const express = require("express");
const { renderAminSigninPage } = require("../controllers/view.controller");
const usersVerifyUtils = require("../utils/users.verify.utils");
const router = express.Router();

//admin views
router.get('/admin/signin', renderAminSigninPage);
router.get('/admin/dashboard/:id',usersVerifyUtils.verifyAdminbyId, renderAminSigninPage);


module.exports = router;