const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');
const { verifyAdminbyId } = require('../utils/users.verify.utils');
const { updateProfilePicture, uploadStoreImage, uploadStorePDF, uploadStoreDoc, updateAdminUsername } = require('../controllers/admin.controller');

const profilePicUploadsPath = multer({
    dest: path.join(__dirname, "..", "AT-FS", "images", "profile_pictures")
});

const storeImagesUploadsPath = multer({
    dest: path.join(__dirname, "..", "AT-FS", "images", "store_images")
});

const storePDFsUploadsPath = multer({
    dest: path.join(__dirname, "..", "AT-FS", "pdfs", "store_pdfs")
});

const storeDocsUploadsPath = multer({
    dest: path.join(__dirname, "..", "AT-FS", "docs", "store_docs")
});

router.post("/admins/profile/update-component/profile-picture/:id/:old_filename/", verifyAdminbyId, profilePicUploadsPath.single("profile_picture"), updateProfilePicture);
router.post("/admins/profile/update-component/username/:id/:v", verifyAdminbyId, updateAdminUsername);

//store uploads
router.post("/admin/store/uploads/:visibility/image/:id", verifyAdminbyId, storeImagesUploadsPath.single("fileUpload"), uploadStoreImage);
router.post("/admin/store/uploads/:visibility/pdf/:id", verifyAdminbyId, storePDFsUploadsPath.single("fileUpload"), uploadStorePDF);
router.post("/admin/store/uploads/:visibility/doc/:id", verifyAdminbyId, storeDocsUploadsPath.single("fileUpload"), uploadStoreDoc);

module.exports = router;