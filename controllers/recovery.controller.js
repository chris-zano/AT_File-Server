const { Admins, Codes, Customers } = require("../utils/db.exports.utils");
const { logSession, logError } = require("../utils/logs.utils");
const { sendVerificationCode, emailRegexp } = require("../utils/mailer.utils");
const { hashPassword, comparePassword } = require("../utils/password.utils");
const email_Regex = emailRegexp();
const Code = Codes();
const modeToCollection = { "admin": Admins, "customer": Customers };

module.exports.recovery_VerifyEmail = async (req, res) => {
    const { email, mode } = req.params;

    if (!email || !mode) {
        return res.status(400).json({ error: "bad request" });
    }


    const matchModeToCollection = modeToCollection[mode];

    if (!matchModeToCollection) {
        return res.status(400).json({ error: "bad request" });
    }

    const email_exists = await matchModeToCollection().findOne({ email: email });
    console.log(email_exists);
    if (!email_exists) {
        return res.status(404).json({ error: "email does not exist" });
    }

    try {
        const responseFromMailer = await sendVerificationCode(email);
        const new_code_entry = new Code({ recipient_email: responseFromMailer.recipient_email[0], code: responseFromMailer["verify-code"], messageId: responseFromMailer.messageId });

        const codeObject = await new_code_entry.save();

        return res.status(200).json({ id: codeObject._id });
    } catch (error) {
        logError(error, "/admins/signup/initiate", "verifyEmail");
        return res.status(500).json({ error: "Failed to send verification code" });
    }
}

module.exports.recovery_VerifyCode = async (req, res) => {
    const { cid, code, email } = req.query;

    const codeMatch = await Code.findOne({ _id: cid, code: code, recipient_email: email });
    if (!codeMatch) {
        res.status(409).json({ message: "Invalid Code" });
        return;
    }

    res.status(200).json({ message: "success" });
}

module.exports.recovery_SetNewPassword = async (req, res) => {
    const { email, password } = req.body;
    const {mode} = req.params

    try {
        const hashedPassword = await hashPassword(password);
        const matchModeToCollection = modeToCollection[mode];

        await matchModeToCollection().updateOne({email: email}, {
            $set: {
                password: hashedPassword.hashedPassword,
                password_salt: hashedPassword.salt
            }
        })

        res.status(200).json({ message: "success" });

    } catch (error) {
        console.log(error)
        logError(error, "/admins/signup/set-password", "setNewAdminPassword");
        return res.status(500).json({ error: "Internal Sserver Error" });
    }
}