const { Admins, Codes } = require("../utils/db.exports.utils");
const { logSession, logError } = require("../utils/logs.utils");
const { sendVerificationCode, emailRegexp } = require("../utils/mailer.utils");
const { hashPassword, comparePassword } = require("../utils/password.utils");
const email_Regex = emailRegexp();
const Admin = Admins();
const Code = Codes();


module.exports.authenticateAdminLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        logSession("no_user_name", req.ip, "Failed");
        res.status(400);
        return;
    }

    let userMatch;
    if (email_Regex.test(username)) {
        userMatch = await Admin.findOne({ email: username });
    }
    else {
        userMatch = await Admin.findOne({ username: username });
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
    res.status(200).json({ message: "success", user: userMatch });
}

module.exports.verifyEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
    }

    const email_exists = await Admin.findOne({ email: email });
    console.log(email_exists);

    if (email_exists) {
        res.status(409).json({ error: "email already in use" });
        return;
    }

    try {
        const responseFromMailer = await sendVerificationCode(email)
        const new_code_entry = new Code({ receipient_email: responseFromMailer.receipient_email[0], code: responseFromMailer["verify-code"], messageId: responseFromMailer.messageId });

        const codeObject = await new_code_entry.save();

        res.status(200).json({ id: codeObject._id });
        return;

    } catch (error) {
        logError(error, "/admins/signup/initiate", "verifyEmail");
        res.status(500).json({ error: "Failed to send verification code" });
    }
}

module.exports.verifyCode = async (req, res) => {
    const { codeId, user_input } = req.body;

    const codeMatch = await Code.findOne({ _id: codeId, code: user_input });
    if (!codeMatch) {
        res.status(409).json({ message: "Invalid Code" });
        return;
    }

    res.status(200).json({ message: "success" });
}

module.exports.setNewAdminPassword = async (req, res) => {
    const { email, user_password } = req.body;

    try {
        const hashedPassword = await hashPassword(user_password);

        const new_admin = new Admin({ email: email, password: hashedPassword.hashedPassword, password_salt: hashedPassword.salt });

        const admin = await new_admin.save();
        
        res.status(200).json({ user: { id: admin._id, email: admin.email, username: admin.username, firstName: admin.firstName, lastName: admin.lastName, profilePicURL: admin.profilePicURL, downloads: admin.downloads, mailed: admin.mailed, favourites: admin.favourites } });
    
    } catch (error) {
        logError(error, "/admins/signup/set-password", "setNewAdminPassword");
        res.status(500);
    }
}