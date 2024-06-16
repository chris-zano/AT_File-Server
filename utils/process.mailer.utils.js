const nodemailer = require("nodemailer");
const { getEmailAuthCredentials } = require('../requireStack');
const EMAIL_AUTH = getEmailAuthCredentials();



process.on('message', async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "hotmail",
            auth: { ...EMAIL_AUTH }
        });

        const response = await transporter.sendMail(options);

        process.send({status: "success", response: response});
    } catch (error) {
        process.send({status: "failed", response: error})
    }
});