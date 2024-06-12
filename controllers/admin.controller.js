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
            logError(error, req.url, "updateProfilePicture~ delete_current_profilePicture");
            return res.status(500).redirect(`/admin/views/profile/${id}`);
        }
    }

    try {
        const profilePicURL = `/files/users/images/profilePicurl/${filename}`
        await Admin.updateOne({ _id: id }, {
            $set: {
                profilePicURL: profilePicURL
            }
        });

        return res.status(200).redirect(`/admin/views/profile/${id}`);
    }
    catch (error) {
        logError(error, req.url, "updateProfilePicture");
        return res.status(500).redirect(`/admin/views/profile/${id}`);
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
    } catch (error) {
        logError(error, req.url, "updateAdminUsername");
        return res.status(500).redirect(`/admin/views/profile/${id}`);
    }

    return res.status(200).redirect(`/admin/views/profile/${id}`);
}

module.exports.uploadStoreFile = async (req, res) => {
    const { filename, originalname, mimetype, encoding, size } = req.file,
        { title, description, visibility } = req.body,
        { fileType } = req.params,
        admin_id = req.verifiedUser.id,
        file_size = `${(size / (1024 * 1024)).toFixed(2)}MB`,
        filePathUrl = `/files/store/${fileType}/${filename}`;

    const matchFileTypeString = { 'image': "Image File", 'pdf': "PDF document", 'doc': "Word Document" };
    const typeofFile = matchFileTypeString[fileType];
    if (!typeofFile) return res.status(400).redirect(`/admin/views/uploads/${admin_id}`);
    const fileObject = { admin_id, title, description, filename, originalname, mimetype, encoding, file_size, filePathUrl, type:typeofFile, visibility };

    try {
        const newFileDocument = new File_(fileObject);
        await newFileDocument.save();

        return res.status(200).redirect(`/admin/views/uploads/${admin_id}`);

    } catch (error) {
        logError(error, req.url, "uploadStoreFile");
        return res.status(500).redirect(`/admin/views/uploads/${admin_id}`);
    }
}

module.exports.updateFileContents = async (req, res) => {
    const { file_id } = req.params;
    const { title, description, visibility } = req.body;
    try {
        await File_.updateOne({ _id: file_id }, {
            $set: {
                title: title,
                description: description,
                visibility: visibility
            },
            $inc: {
                __v: 1
            }
        });
    }
    catch (error) {
        logError(error, req.url, "updateFileContents");
        res.status(500).redirect(`/admin/views/dashboard/${req.verifiedUser.id}`);
    }
    return res.status(200).redirect(`/admin/views/dashboard/${req.verifiedUser.id}`)
}

module.exports.deleteOneFile = async (req, res) => {
    const { file_id } = req.params;

    try {
        await File_.deleteOne({_id: file_id});
    }catch(error){
        logError(error, req.url, "deleteOneFile");
        return res.status(500).json({message: "An unexpected error occured. Failed to delete"});
    }
    
    return res.status(200).json({ message: "success" });
}