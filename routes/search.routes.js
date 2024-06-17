const express = require("express");
const { verifyUserBySession } = require("../utils/users.verify.utils");
const { renderSearchPage } = require("../controllers/search.controller");
const router = express.Router();

router.get("/global/views/search/:session/:id", verifyUserBySession, renderSearchPage);

module.exports = router;