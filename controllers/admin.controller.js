const { Admins } = require("../utils/db.exports.utils");
const { logError } = require("../utils/logs.utils");

const Admin = Admins();

module.exports.updateProfilePicture = async (req, res) => {
    const { filename } = req.file;
    const profilePicURL = `/files/users/images/profilePicurl/${filename}`
    try {
       
        await Admin.updateOne({ _id: req.params.id }, {
            $set: {
                profilePicURL: profilePicURL
            }
        })

        res.redirect(`/admin/views/profile/${req.params.id}`)
    }
    catch(error) {
        logError(error, `/admins/profile/update-component/profile-picture/${req.params.id}`, "updateProfilePicture");
        res.status(500);
    }
    
}

module.exports.uploadStoreImage = (req, res) => {
    const {filename} = req.file;
    console.log("a new Image has been upload as: ", filename);
    res.end("hello");
}
module.exports.uploadStorePDF = (req, res) => {
    const {filename} = req.file;
    console.log("a new PDF has been upload as: ", filename);
    res.end("hello");
}
module.exports.uploadStoreDoc = (req, res) => {
    const {filename} = req.file;
    console.log("a new Doc has been upload as: ", filename);
    res.end("hello");
}