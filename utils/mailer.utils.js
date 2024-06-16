const path = require('path')
const randomstring = require("randomstring");
const { createEmailTemplateForVerificationCode, createEmailTemplateForPasswordResetAttempt, createEmailTemplateForPasswordResetConfirmation, createEmailTemplateForFileSharing } = require("./email_template.utils");
const { logError } = require("./logs.utils");
const { fork } = require('child_process');


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




const transportMail = async (options) => {
    // const response = await transporter.sendMail(options); //old code
    // return response;

    // fork a child process and parse the options as argument
    return new Promise((resolve, reject) => {
        const child = fork(path.join(__dirname, 'process.mailer.utils.js'))

        child.send(options);

        child.on("message", (results) => {
            //kill the child
            child.kill();

            if (results.status === "success") {
                resolve(results.response);
            }
            else {
                reject(results.response);
            }
        });

        child.on("error", (error) => {
            //kill the child
            child.kill();
            reject(error);
        });
    })
}

module.exports.sendVerificationCode = async (recipient_email) => {

    if (!(EMAIL_REGEXP.test(recipient_email))) {
        return {
            operationStatus: "Failed",
            message: "Invalid Email"
        }
    }

    const verificationCode = generateVerificationCode();

    const options = {
        from: system_email,
        to: recipient_email,
        subject: "(AT-File Server): Here is your verification code!",
        html: createEmailTemplateForVerificationCode(verificationCode)
    }

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

    const options = {
        from: system_email,
        to: recipient_email,
        subject: "(AT-File Server): Password Reset Attempt",
        html: createEmailTemplateForPasswordResetAttempt(recipient_email, username, userId, admin)
    }

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

    const options = {
        from: system_email,
        to: recipient_email,
        subject: "(AT-File Server): Your Password Has Been Changed",
        html: createEmailTemplateForPasswordResetConfirmation()
    }

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

const isFileObjectValid = (fileObject = { filename: "", path: "", size: "" }) => {
    const expectedkeys = ["filename", "path", "size"];
    const objectkeys = Object.keys(fileObject);

    if (objectkeys.length !== expectedkeys.length) return false

    for (const key of expectedkeys)
        if (!(fileObject.hasOwnProperty(key))) return false;

    if (typeof fileObject.filename !== 'string' || fileObject.filename.length === 0) return false;

    if (typeof fileObject.path !== 'string' || fileObject.path.length === 0) return false;

    if (typeof fileObject.size !== 'string' || fileObject.size.length === 0) return false;

    if (path.resolve(fileObject.path) !== fileObject.path) return false

    return true;

}

module.exports.sendFilesViaEmail = async (fileObjects = [], recipients = [], username = "ATFS_user", message = "") => {
    if (!Array.isArray(fileObjects) || !Array.isArray(recipients) || fileObjects.length === 0 || recipients.length === 0) {
        return {
            state: "Failed",
            message: "[ ArgumentError ] :: Invalid arguments",
            recipients: undefined,
            rejected: undefined
        };
    }

    const validFileObjects = fileObjects.filter((obj) => isFileObjectValid(obj));
    if (validFileObjects.length === 0) {
        return {
            state: "Failed",
            message: "[ ArgumentError ] :: No valid file objects",
            recipients: undefined,
            rejected: undefined
        };
    }

    const defaultMessage = "Please find the attached files below. If you have any questions, feel free to reach out."
    const finalMessage = message.length === 0 ? defaultMessage : message;

    const options = {
        from: system_email,
        to: recipients,
        subject: "(AT-File Server): A File Has Been Shared With You",
        html: createEmailTemplateForFileSharing(username, finalMessage),
        attachments: fileObjects.map((file) => (
            {
                filename: file.filename,
                path: file.path
            }
        ))
    }

    try {
        const response = await transportMail(options);
        return {
            state: "Success",
            message: response.messageId,
            recipients: response.accepted,
            rejected: response.rejected
        }
    }
    catch (error) {
        logError(error, "/users/share-file", "sendFilesViaEmail");
        return {
            state: "Failed",
            message: "[ ServerError ] :: Unable to send email",
            recipients: undefined,
            rejected: undefined
        };
    }
}