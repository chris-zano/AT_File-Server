const { Customers, Files } = require('../utils/db.exports.utils');
const mailer = require('../utils/mailer.utils');
const emailregexp = mailer.emailRegexp();

module.exports.shareFileController = async (req, res) => {
    const { id, subject, message, receipients } = req.body;
    const validReceipientEmails = Array.isArray(receipients) ? receipients.filter((receipient) => (emailregexp.test(receipient))) : [];

    console.log({ id, subject, message, validReceipientEmails });
    res.status(200).json({message: "received"});
}