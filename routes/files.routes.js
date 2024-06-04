const express = require("express");
const { serveScripts, serveStyleSheets, serveFavicon, serveTypeface, serveSystemImages, serveUserProfilePictures } = require("../controllers/files.controller");
const router = express.Router();

router.get('/files/scripts/:directory/:filename', serveScripts);
router.get('/files/css/:directory/:filename', serveStyleSheets);
router.get('/files/favicon/', serveFavicon);
router.get('/files/typeface/:filename', serveTypeface);
router.get('/files/system/images/:filename', serveSystemImages);
router.get('/files/users/images/profilePicurl/:filename', serveUserProfilePictures);

module.exports = router;