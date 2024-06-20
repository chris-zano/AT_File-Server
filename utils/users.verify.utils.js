const { Admins, Customers } = require('./db.exports.utils');

const Admin = Admins();
const Customer = Customers();

module.exports.verifyUserbyId = async (req, res, next) => {
    try {
        const user = await Customer.findOne({ _id: req.params.id });

        if (!user) {
            res.status(409).redirect("/signin");
            return;
        }

        // Create the resulting object with id instead of _id
        req.verifiedUser = {
            id: user._id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePicURL: user.profilePicURL,
            favourites: user.favourites,
            downloads: user.downloads,
            mailed: user.mailed,
            v: user.__v,
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports.verifyAdminbyId = async (req, res, next) => {
    try {
        const user = await Admin.findOne({ _id: req.params.id });
        if (!user) {
            res.status(409);
            res.redirect("/signin");
            return;
        }

        req.verifiedUser = {
            id: user._id,
            username: user.username,
            profilePicURL: user.profilePicURL,
            email: user.email,
            v: user.__v
        };

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}

module.exports.verifyUserBySession = (req, res, next) => {
    console.log("here")
    const { session } = req.params;

    if (session === "admin") {
        return module.exports.verifyAdminbyId(req, res, next);
    } else if (session === "user") {
        return module.exports.verifyUserbyId(req, res, next);
    } else {
        return res.status(500).send('Internal Server Error');
    }
}