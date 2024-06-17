const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const { verifyUserbyId } = require('../utils/users.verify.utils');
const { shareFileController, addToFavorites, addToDownloads, updateProfilePicture } = require('../controllers/users.controller');

const profilePicUploadsPath = multer({
    dest: path.join(__dirname, "..", "AT-FS", "images", "profile_pictures")
});


router.post("/users/share-file", shareFileController);
router.post("/users/add-to-favorites", addToFavorites);
router.post("/users/add-to-downloads", addToDownloads);

router.post("/users/profile/update-component/profile-picture/:id/:oldProfilePictureFilename", verifyUserbyId,profilePicUploadsPath.single("profile_picture"), updateProfilePicture)


module.exports = router;