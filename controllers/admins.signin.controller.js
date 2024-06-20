const { Admins, Codes } = require("../utils/db.exports.utils");
const { logSession, logError } = require("../utils/logs.utils");
const { sendVerificationCode, emailRegexp } = require("../utils/mailer.utils");
const { hashPassword, comparePassword } = require("../utils/password.utils");
const email_Regex = emailRegexp();
const Admin = Admins();
const Code = Codes();
const randomstring = require("randomstring");
const crypto = require('crypto');

const generateTempId = () => {
    return crypto.randomUUID();
}

const generateVerificationCode = () => {
    return randomstring.generate({
        length: 6,
        charset: 'alphanumeric'
    });
}

module.exports.authenticateAdminLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        logSession("no_user_name", req.ip, "Failed");
        return res.status(400).json({ message: "Username and password are required", user: {} });
    }


    try {
        const userMatch = email_Regex.test(username)
            ? await Admin.findOne({ email: username })
            : await Admin.findOne({ username: username });

        if (!userMatch) {
            logSession(`Incorrect username:://${username}`, req.ip, "Failed");
            return res.status(404).json({ message: "User not found", user: {} });
        }

        const passwordIsMatch = await comparePassword(password, userMatch.password);
        if (!passwordIsMatch) {
            logSession(`Incorrect Password:://${username}//`, req.ip, "Failed");
            return res.status(404).json({ message: "Incorrect Password.", user: {} });
        }


        logSession(username, req.ip, "Success");
        const user = { id: userMatch._id, username: userMatch.username, email: userMatch.email, __v: userMatch.__v }
        return res.status(200).json({ message: "success", user });

    } catch (error) {
        logError(error, req.url, "authenticateAdminLogin");
        return res.status(500).json({ message: "An unexpected error occured", user: {} });
    }

}

module.exports.verifyEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ id: null, message: "Invalid email" });

    try {
        const email_exists = await Admin.findOne({ email: email });
        if (email_exists !== null) return res.status(409).json({ error: "email already in use" });

        const verificationCode = generateVerificationCode(), tempId = generateTempId();
        res.status(202).json({ id: tempId });

        try {
            return await sendVerificationCode(email, verificationCode, tempId);
        } catch (error) {
            logError(new Error(error), req.url, "verifyEmail[async mailer::try-catch]");
            return res.status(500).json({ id: null, message: "An unexpected error occured" });
        }

    } catch (error) {
        logError(error, "/admins/signup/initiate", "verifyEmail");
        return res.status(500).json({ id: null, message: "Failed to send verification code" });
    }
}

module.exports.verifyCode = async (req, res) => {
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

module.exports.setNewAdminPassword = async (req, res) => {
    const { email, user_password } = req.body;

    try {
        const hashedPassword = await hashPassword(user_password);

        if (hashedPassword.error === null) {
            const new_admin = new Admin({ email: email, password: hashedPassword.hashedPassword, password_salt: hashedPassword.salt });
            const admin = await new_admin.save();
            return res.status(200).json({ user: { id: admin._id, email: admin.email, username: admin.username, profilePicURL: admin.profilePicURL }, message: "Success" });
        }
        else {
            console.log("HashPassword Error::// ", hashedPassword.error);
            return res.status(400).json({ user: {}, message: "Invalid Password" });
        }

    } catch (error) {
        logError(error, "/admins/signup/set-password", "setNewAdminPassword");
        return res.status(500).json({ message: "An unexpected error occured" });
    }
}