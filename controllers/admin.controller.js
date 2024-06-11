const { Admins, Files } = require("../utils/db.exports.utils");
const { logError } = require("../utils/logs.utils");
const Admin = Admins();
const File_ = Files()

const fs = require("fs");
const path = require("path");

module.exports.updateProfilePicture = async (req, res) => {
    const { id } = req.verifiedUser;
    const { filename } = req.file;
    const { old_filename } = req.params;

    if (old_filename) {
        try {
            const current_userImagePath = path.join(__dirname, "..", "AT-FS", "images", "profile_pictures", old_filename);
            if (fs.existsSync(current_userImagePath)) fs.rm(current_userImagePath, (console.error))
        } catch (error) {
            logError(error, `/admins/profile/update-component/profile-picture/${id}/${req.params.old_filename}`, "updateProfilePicture~ delete_current_profilePicture");
            res.status(500);
        }
    }

    try {
        const profilePicURL = `/files/users/images/profilePicurl/${filename}`
        await Admin.updateOne({ _id: id }, {
            $set: {
                profilePicURL: profilePicURL
            }
        });

        res.redirect(`/admin/views/profile/${id}`);
    }
    catch (error) {
        logError(error, `/admins/profile/update-component/profile-picture/${id}`, "updateProfilePicture");
        res.status(500);
    }

}

module.exports.updateAdminUsername = async (req, res) => {
    const { id, v } = req.verifiedUser;
    const { username } = req.body;

    if (!id) return res.status(403).render('error', { error: "unauthorixed access", status: 403 });

    try {
        await Admin.updateOne({ _id: id, __v: v }, {
            $set: {
                username: username
            },
            $inc: {
                __v: 1
            }
        })
    } catch (error) { console.error }

    return res.status(200).redirect(`/admin/views/profile/${id}`);
}

module.exports.uploadStoreFile = async (req, res) => {
    const { filename, originalname, mimetype, encoding, size } = req.file,
        { title, description } = req.body,
        {fileType } = req.params,
        admin_id = req.verifiedUser.id,
        file_size = `${(size / (1024 * 1024)).toFixed(2)}MB`,
        filePathUrl = `/files/store/${fileType}/${filename}`,
        fileObject = { admin_id, title, description, filename, originalname, mimetype, encoding, file_size, filePathUrl };

    try {
        const newFileDocument = new File_(fileObject);
        await newFileDocument.save();

        res.status(200).redirect(`/admin/views/uploads/${id}`);

    } catch (error) {
        logError(error, req.url, "uploadStoreFile");
        return res.status(500).redirect(`/admin/views/uploads/${id}`);
    }


    res.end("hello");
}