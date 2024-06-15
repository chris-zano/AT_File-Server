const nodemailer = require("nodemailer");
const path = require('path')
const randomstring = require("randomstring");
const { createEmailTemplateForVerificationCode, createEmailTemplateForPasswordResetAttempt, createEmailTemplateForPasswordResetConfirmation } = require("./email_template.utils");
const { logError } = require("./logs.utils");
const { getEmailAuthCredentials } = require('../requireStack');
const EMAIL_AUTH = getEmailAuthCredentials();

const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports.emailRegexp = () => {
    return EMAIL_REGEXP;
}

const system_email = "no-reply.atfs@hotmail.com";

const generateVerificationCode = () => {
    return randomstring.generate({
        length: 6,
        charset: 'alphanumeric'
    });
}

const transporter = nodemailer.createTransport({
    service: "hotmail",
    port: 465,
    secure: true,
    auth: { ...EMAIL_AUTH }
});

const options = {
    from: system_email,
    to: "",
    subject: "",
    html: "",
}



const transportMail = async (options) => {
    const response = await transporter.sendMail(options);
    return response;
}

module.exports.sendVerificationCode = async (recipient_email) => {

    if (!(EMAIL_REGEXP.test(recipient_email))) {
        return {
            operationStatus: "Failed",
            message: "Invalid Email"
        }
    }

    const verificationCode = generateVerificationCode();
    options.to = recipient_email;
    options.subject = "(AT-File Server): Here is your verification code!";
    options.html = createEmailTemplateForVerificationCode(verificationCode);

    try {
        const response = await transportMail(options);
        return {
            messageId: response.messageId,
            recipient_email: response.accepted,
            "verify-code": verificationCode,
        }
    }
    catch (error) {
        logError(error, "/system/mail-verification-code", "transportMail(options:any)");
        return null;
    }
}

module.exports.alertUserOfPasswordResetAttempt = async (recipient_email, username, userId, admin) => {
    if (!(EMAIL_REGEXP.test(recipient_email))) {
        return {
            operationStatus: "Failed",
            message: "Invalid Email"
        }
    }

    options.to = recipient_email;
    options.subject = "(AT-File Server): Password Reset Attempt";
    options.html = createEmailTemplateForPasswordResetAttempt(recipient_email, username, userId, admin);

    try {
        const response = await transportMail(options);
        return {
            messageId: response.messageId,
            recipient_email: response.accepted,
        }
    }
    catch (error) {
        logError(error, "/system/mail-verification-code", "transportMail(options:any)");
        return null;
    }
}

module.exports.informUserOfSuccessfulPasswordReset = async (recipient_email) => {
    if (!(EMAIL_REGEXP.test(recipient_email))) {
        return {
            operationStatus: "Failed",
            message: "Invalid Email"
        }
    }

    options.to = recipient_email;
    options.subject = "(AT-File Server): Your Password Has Been Changed";
    options.html = createEmailTemplateForPasswordResetConfirmation();

    try {
        const response = await transportMail(options);
        return {
            messageId: response.messageId,
            recipient_email: response.accepted,
        }
    }
    catch (error) {
        logError(error, "/system/mail-verification-code", "transportMail(options:any)");
        return null;
    }
}

const isFileObjectValid = (fileObject = { filename: "", path: "" }) => {
    const expectedkeys = ["filename", "path"];
    const objectkeys = Object.keys(fileObject);

    if (objectkeys.length !== expectedkeys.length) return false

    for (const key of expectedkeys)
        if (!(fileObject.hasOwnProperty(key))) return false;

    if (typeof fileObject.filename !== 'string' || fileObject.filename.length === 0) return false;

    if (typeof fileObject.path !== 'string' || fileObject.path.length === 0) return false;

    if (path.resolve(fileObject.path) !== fileObject.path) return false

    return true;

}

module.exports.sendFilesViaEmail = (fileObjects = [], recipients = []) => {
    if (!Array.isArray(fileObjects) || !Array.isArray(recipients) || fileObjects.length === 0 || recipients.length === 0) {
        return { rejectAll: true };
    }

    const validFileObjects = fileObjects.filter((obj) => isFileObjectValid(obj));

    console.log(validFileObjects);

    return true;
}