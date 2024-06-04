const { Admins } = require("../utils/db.exports.utils")

const Admin = Admins();

module.exports.updateProfilePicture = (req, res) => {
    console.log(req.file);
    res.status(200).json("updated");
    // Admin.updateOne({_id: req.params.id}, {
    //     $set: {
    //         profilePicURL: req.file.path
    //     }
    // })
}