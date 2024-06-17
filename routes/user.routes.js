const express = require('express');
const { shareFileController, addToFavorites, addToDownloads } = require('../controllers/users.controller');
const router = express.Router();

router.post("/users/share-file", shareFileController);
router.post("/users/add-to-favorites", addToFavorites);
router.post("/users/add-to-downloads", addToDownloads);


module.exports = router;