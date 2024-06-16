const { Customers, Codes } = require("../utils/db.exports.utils");
const { logSession, logError } = require("../utils/logs.utils");
const { sendVerificationCode, emailRegexp } = require("../utils/mailer.utils");
const { hashPassword, comparePassword } = require("../utils/password.utils");
const email_Regex = emailRegexp();
const Customer = Customers();
const Code = Codes();


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

module.exports.initiateSignUpSequence = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
    }

    const email_exists = await Customer.findOne({ email: email });

    if (email_exists) {
        res.status(409).json({ error: "email already in use" });
        return;
    }

    try {
        const responseFromMailer = await sendVerificationCode(email)
        const new_code_entry = new Code({ recipient_email: responseFromMailer.recipient_email[0], code: responseFromMailer["verify-code"], messageId: responseFromMailer.messageId });

        const codeObject = await new_code_entry.save();

        res.status(200).json({ id: codeObject._id });
        return;

    } catch (error) {
        logError(error, "/users/signup/initiate", "initiateSignUpSequence");
        res.status(500).json({ error: "Failed to send verification code" });
    }
}

module.exports.verifySignUpCode = async (req, res) => {
    const { codeId, user_input } = req.body;

    const codeMatch = await Code.findOne({ _id: codeId, code: user_input });
    if (!codeMatch) {
        res.status(409).json({ message: "Invalid Code" });
        return;
    }

    res.status(200).json({ message: "success" });
}

module.exports.setNewPassword = async (req, res) => {
    const { email, user_password } = req.body;

    try {
        const hashedPassword = await hashPassword(user_password);

        const new_customer = new Customer({ email: email, password: hashedPassword.hashedPassword, password_salt: hashedPassword.salt });

        const customer = await new_customer.save();
        res.status(200).json({ user: { id: customer._id, email: customer.email, username: customer.username, firstName: customer.firstName, lastName: customer.lastName, profilePicURL: customer.profilePicURL, downloads: customer.downloads, mailed: customer.mailed, favourites: customer.favourites } });
    } catch (error) {
        logError(error, "/users/signup/set-password", "setNewPassword");
        res.status(500);
    }
}