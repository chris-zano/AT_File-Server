const express = require("express");
const { renderGettinStartedPage, renderSigninPage } = require("../controllers/view.controller");
const router = express.Router();

router.get('/', renderGettinStartedPage);
router.get('/signin', renderSigninPage);
// router.get('/store', renderCustomerStore);

module.exports = router;