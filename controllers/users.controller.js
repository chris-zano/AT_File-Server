const { Customers, Files } = require('../utils/db.exports.utils');
const mailer = require('../utils/mailer.utils');

module.exports.shareFileController = async (req, res) => {
    const { id, subject, message, receipients } = req.body;

    console.log({ id, subject, message, receipients });
    res.status(200).json({message: "received"});
}