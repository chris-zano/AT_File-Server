const { Admins, Customers } = require('./db.exports.utils');

const Admin = Admins();
const Customer = Customers();

module.exports.verifyUserbyId = async (req, res, next) => {
    const user = await Customer.findOne({ _id: req.params.id });
    if (!user) {
        res.status(409);
        res.redirect("/signin");
        return;
    }

    req.verifiedUser = { id: user._id, username: user.username };
    next();
}

module.exports.verifyAdminbyId = async (req, res, next) => {
    const user = await Admin.findOne({ _id: req.params.id });
    if (!user) {
        res.status(409);
        res.redirect("/signin");
        return;
    }

    req.verifiedUser = { id: user._id, username: user.username, profilePicURL: user.profilePicURL, email: user.email };
    next();
}