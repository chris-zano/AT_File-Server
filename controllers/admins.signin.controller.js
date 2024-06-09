const { Admins, Codes } = require("../utils/db.exports.utils");
const { logSession, logError } = require("../utils/logs.utils");
const { sendVerificationCode, emailRegexp } = require("../utils/mailer.utils");
const { hashPassword, comparePassword } = require("../utils/password.utils");
const email_Regex = emailRegexp();
const Admin = Admins();
const Code = Codes();


module.exports.authenticateAdminLogin = async (req, res) => {
    const { username, password } = req.body;
    console.log({username, password})

    if (!username || !password) {
        logSession("no_user_name", req.ip, "Failed");
        res.status(400);
        return;
    }

    console.log("Breakpoint 1 - made it here")

    let userMatch;
    if (email_Regex.test(username)) {
        userMatch = await Admin.findOne({ email: username });
        console.log("Breakpoint 2 - made it here")

    }
    else {
        userMatch = await Admin.findOne({ username: username });
        console.log("Breakpoint 3 - made it here")

    }
    console.log("Breakpoint 4 - made it here")

    if (!userMatch) {
        logSession(username, req.ip, "Failed");
        res.status(404).json({ message: "User not found" });
        console.log("Breakpoint 5 - made it here")

        return;
    }

    const passwordIsMatch = await comparePassword(password, userMatch.password);

    console.log("Breakpoint 6 - made it here", userMatch.password)
    console.log(passwordIsMatch);

    if (!passwordIsMatch) {
        logSession(username, req.ip, "Failed");
        res.status(404).json()
        console.log("Breakpoint 7 - made it here")

        return;
    }

    logSession(username, req.ip, "Success");
    const user = { id: userMatch._id, username: userMatch.username, email: userMatch.email, __v: userMatch.__v }
    console.log(user);
    console.log("Breakpoint 8 - made it here")

    res.status(200).json({ message: "success", user });
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

        res.status(200).json({ user: { id: admin._id, email: admin.email, username: admin.username, profilePicURL: admin.profilePicURL } });

    } catch (error) {
        logError(error, "/admins/signup/set-password", "setNewAdminPassword");
        res.status(500);
    }
}