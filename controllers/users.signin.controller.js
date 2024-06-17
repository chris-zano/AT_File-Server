const { Customers, Codes } = require("../utils/db.exports.utils");
const { logSession, logError } = require("../utils/logs.utils");
const { sendVerificationCode, emailRegexp } = require("../utils/mailer.utils");
const { hashPassword, comparePassword } = require("../utils/password.utils");
const email_Regex = emailRegexp();
const Customer = Customers();
const Code = Codes();
const crypto = require('crypto');
const randomstring = require("randomstring");

const generateTempId = () => {
    return crypto.randomUUID();
}

module.exports.authenticateWithUsernameAndPassword = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        logSession("no_user_name", req.ip, "Failed");
        res.status(400);
        return;
    }

    let userMatch;
    if (email_Regex.test(username)) {
        userMatch = await Customer.findOne({ email: username });
    }
    else {
        userMatch = await Customer.findOne({ username: username });
    }

    if (!userMatch) {
        logSession(username, req.ip, "Failed");
        res.status(404).json({ message: "User not found" });
        return;
    }

    const passwordIsMatch = await comparePassword(password, userMatch.password);

    if (!passwordIsMatch) {
        logSession(username, req.ip, "Failed");
        res.status(404).json()
        return;
    }

    logSession(username, req.ip, "Success");

    res.status(200).json({ message: "success", user: { id: userMatch._id, email: userMatch.email, username: userMatch.username, firstName: userMatch.firstName, lastName: userMatch.lastName, profilePicURL: userMatch.profilePicURL, downloads: userMatch.downloads, mailed: userMatch.mailed, favourites: userMatch.favourites, v: userMatch.__v } });
}

const generateVerificationCode = () => {
    return randomstring.generate({
        length: 6,
        charset: 'alphanumeric'
    });
}

module.exports.initiateSignUpSequence = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ id: null, message: "Invalid email" });

    try {
        const email_exists = await Customer.findOne({ email: email });
        if (email_exists !== null) return res.status(409).json({ error: "email already in use" });

        const verificationCode = generateVerificationCode(), tempId = generateTempId();
        res.status(202).json({ id: tempId, message: "request accepted" });

        try {
            return await sendVerificationCode(email, verificationCode, tempId);
        } catch (error) {
            logError(new Error(error), req.url, "initiateSignUpSequence[async mailer::try-catch]");
            return res.status(500).json({ id: null, message: "An unexpected error occured" });
        }

    } catch (error) {
        logError(error, "/users/signup/initiate", "initiateSignUpSequence");
        res.status(500).json({ id: null, message: "Failed to send verification code" });
    }
}

module.exports.verifySignUpCode = async (req, res) => {
    const { codeId, user_input } = req.body;

    try {
        const codeMatch = await Code.findOne({ tempId: codeId, code: user_input });
        if (!codeMatch) {
            return res.status(409).json({ message: "Invalid Code" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server error" });
    }

    return res.status(200).json({ message: "success" });
}

module.exports.setNewPassword = async (req, res) => {
    const { email, user_password } = req.body;

    console.log({ email, user_password })
    try {
        const hashedPassword = await hashPassword(user_password);

        if (hashedPassword.error === null) {
            const new_customer = new Customer({ email: email, password: hashedPassword.hashedPassword, password_salt: hashedPassword.salt });

            const customer = await new_customer.save();
            res.status(200).json({ user: { id: customer._id, email: customer.email, username: customer.username, firstName: customer.firstName, lastName: customer.lastName, profilePicURL: customer.profilePicURL, downloads: customer.downloads, mailed: customer.mailed, favourites: customer.favourites } });
        }
        else {
            console.log("HashPassword Error::// ", hashedPassword.error);
            return res.status(400).json({ user: {}, message: "Invalid Password" });
        }

    } catch (error) {
        logError(error, "/users/signup/set-password", "setNewPassword");
        return res.status(500).json({ message: "An unexpected error occured" });
    }
}

