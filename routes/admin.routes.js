const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');
const { verifyAdminbyId } = require('../utils/users.verify.utils');
const { updateProfilePicture, uploadStoreFile, updateAdminUsername } = require('../controllers/admin.controller');

const profilePicUploadsPath = multer({
    dest: path.join(__dirname, "..", "AT-FS", "images", "profile_pictures")
});

const storagePaths = {
    image: path.join(__dirname, "..", "AT-FS", "images", "store_images"),
    pdf: path.join(__dirname, "..", "AT-FS", "pdfs", "store_pdfs"),
    doc: path.join(__dirname, "..", "AT-FS", "docs", "store_docs")
};

router.post("/admins/profile/update-component/profile-picture/:id/:old_filename/", verifyAdminbyId, profilePicUploadsPath.single("profile_picture"), updateProfilePicture);
router.post("/admins/profile/update-component/username/:id/:v", verifyAdminbyId, updateAdminUsername);

//store uploads
router.post("/admin/store/uploads/:visibility/:fileType/:id", verifyAdminbyId, (req, res, next) => {
    const { fileType } = req.params;

    const storagePath = storagePaths[fileType];
    // Initialize Multer middleware
    const uploadMiddleware = multer({ dest: storagePath }).single("fileUpload");
    uploadMiddleware(req, res, (err) => {
        if (err) {
            return res.status(500).send("Error uploading file.");
        }
    });

    next();
}, uploadStoreFile);

module.exports = router;