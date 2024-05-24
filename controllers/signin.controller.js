const { Customers } = require("../utils/db.exports.utils");
const { logSession } = require("../utils/logs.utils");
const { hashPassword, comparePassword } = require("../utils/password.utils");



module.exports.authenticateWithUsernameAndPassword = async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        logSession("no_user_name", req.ip, "Failed");
        res.status(400).end();
        return;
    }

    const Customer = Customers();
    const userMatch = await Customer.findOne({username: username});

    if (!userMatch) {
        logSession(username, req.ip, "Failed");
        res.status(404).json({message: "User not found"});
        return;
    }

    const passwordIsMatch = await comparePassword(password, userMatch.password);

    if (!passwordIsMatch) {
        logSession(username, req.ip, "Failed");
        res.status(404).json()
        return;
    }

    logSession(username, req.ip, "Success");
    res.status(200).json({message: "success", user: userMatch});
}

module.exports.initiateSignUpSequence = (req, res) => {
    const {email} = req.body;

    console.log(email);
    res.status(200).json("Sign up sequence initiated");
}

module.exports.verifySignUpCode = (req, res) => {
    const {userEmail, verification_code} = req.body;

    console.log({userEmail, verification_code});
    res.status(200).json("here here");
}

module.exports.setNewPassword = (req, res) => {
    const {userEmail, password} = req.body;

    console.log({userEmail, password});
    res.status(200).json("here here");
}