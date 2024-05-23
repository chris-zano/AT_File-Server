const express = require("express");
const { serveSystemScripts, serveClientScripts, serveStyleSheets,serveFavicon, serveTypeface, serveSystemImages } = require("../controllers/files.controller");
const router = express.Router();

router.get('/files/scripts/system/:filename', serveSystemScripts);
router.get('/files/scripts/client/:filename', serveClientScripts);
router.get('/files/css/:directory/:filename', serveStyleSheets);
router.get('/files/favicon/', serveFavicon);
router.get('/files/typeface/:filename', serveTypeface);
router.get('/files/system/images/:filename', serveSystemImages);

module.exports = router;