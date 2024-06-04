const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');
const { verifyAdminbyId } = require('../utils/users.verify.utils');
const { updateProfilePicture, uploadStoreImage, uploadStorePDF, uploadStoreDoc } = require('../controllers/admin.controller');

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

router.post("/admins/profile/update-component/profile-picture/:id", verifyAdminbyId, profilePicUploadsPath.single("profile_picture"), updateProfilePicture);

//store uploads
router.post("admin/store/uploads/images/:id", verifyAdminbyId, storeImagesUploadsPath.single("store_image"), uploadStoreImage);
router.post("admin/store/uploads/pdfs/:id", verifyAdminbyId, storePDFsUploadsPath.single("store_pdf"), uploadStorePDF);
router.post("admin/store/uploads/pdfs/:id", verifyAdminbyId, storeDocsUploadsPath.single("store_doc"), uploadStoreDoc);

module.exports = router;