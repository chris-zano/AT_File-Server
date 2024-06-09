const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const { createEmailTemplateForVerificationCode, createEmailTemplateForPasswordResetAttempt, createEmailTemplateForPasswordResetConfirmation } = require("./email_template.utils");
const { logError } = require("./logs.utils");
require('dotenv').config();

const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports.emailRegexp = () => {
    return EMAIL_REGEXP;
}

const system_email = "no-reply.atfs@hotmail.com";
const system_email_password = "noreplyPassword@1234"

const generateVerificationCode = () => {
    return randomstring.generate({
        length: 6,
        charset: 'alphanumeric'
    });
}

const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: system_email,
        pass: system_email_password
    }
});

const options = {
    from: system_email,
    to: system_email,
    subject: "",
    html: "",
}



const transportMail = async (options) => {
    const response = await transporter.sendMail(options);
    return response;
}

module.exports.sendVerificationCode = async (receipient_email) => {

    if (!(EMAIL_REGEXP.test(receipient_email))) {
        return {
            operationStatus: "Failed",
            message: "Invalid Email"
        }
    }

    const verificationCode = generateVerificationCode();
    options.to = receipient_email;
    options.subject = "(AT-File Server): Here is your verification code!";
    options.html = createEmailTemplateForVerificationCode(verificationCode);

    try {
        const response = await transportMail(options);
        return {
            messageId: response.messageId,
            receipient_email: response.accepted,
            "verify-code": verificationCode,
        }
    }
    catch (error) {
        logError(error, "/system/mail-verification-code", "transportMail(options:any)");
        return null;
    }
}

module.exports.alertUserOfPasswordResetAttempt = async (receipient_email, username, userId, admin) => {
    if (!(EMAIL_REGEXP.test(receipient_email))) {
        return {
            operationStatus: "Failed",
            message: "Invalid Email"
        }
    }

    options.to = receipient_email;
    options.subject = "(AT-File Server): Password Reset Attempt";
    options.html = createEmailTemplateForPasswordResetAttempt(receipient_email, username, userId, admin);

    try {
        const response = await transportMail(options);
        return {
            messageId: response.messageId,
            receipient_email: response.accepted,
        }
    }
    catch (error) {
        logError(error, "/system/mail-verification-code", "transportMail(options:any)");
        return null;
    }
}

module.exports.informUserOfSuccessfulPasswordReset = async (receipient_email) => {
    if (!(EMAIL_REGEXP.test(receipient_email))) {
        return {
            operationStatus: "Failed",
            message: "Invalid Email"
        }
    }

    options.to = receipient_email;
    options.subject = "(AT-File Server): Your Password Has Been Changed";
    options.html = createEmailTemplateForPasswordResetConfirmation();

    try {
        const response = await transportMail(options);
        return {
            messageId: response.messageId,
            receipient_email: response.accepted,
        }
    }
    catch (error) {
        logError(error, "/system/mail-verification-code", "transportMail(options:any)");
        return null;
    }
}