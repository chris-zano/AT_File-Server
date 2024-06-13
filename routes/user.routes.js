const express = require('express');
const { shareFileController } = require('../controllers/users.controller');
const router = express.Router();

router.post("/users/share-file", shareFileController);

module.exports = router;