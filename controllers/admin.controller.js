const { Admins } = require("../utils/db.exports.utils");
const { logError } = require("../utils/logs.utils");
const Admin = Admins();

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

module.exports.uploadStoreImage = (req, res) => {
    const { filename } = req.file;
    console.log("a new Image has been upload as: ", filename);
    res.end("hello");
}
module.exports.uploadStorePDF = (req, res) => {
    const { filename } = req.file;
    console.log("a new PDF has been upload as: ", filename);
    res.end("hello");
}
module.exports.uploadStoreDoc = (req, res) => {
    const { filename } = req.file;
    console.log("a new Doc has been upload as: ", filename);
    res.end("hello");
}