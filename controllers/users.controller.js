const { Customers, Files } = require('../utils/db.exports.utils');
const { logError } = require('../utils/logs.utils');
const mailer = require('../utils/mailer.utils');
const emailregexp = mailer.emailRegexp();
const mongoose = require('mongoose');
const path = require('path');
const file = Files();


// check if an id is a valid MongoDB ObjectId
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

const getCustomerDetails = async (id) => {
    if (typeof id !== "string" || !isValidObjectId(id)) return { status: "Fail", message: `Invalid Object Id ${id}`, doc: {} };
    const customer = Customers();
    try {
        const matchedDocument = await customer.findOne({ _id: id });
        if (!matchedDocument) return { status: "Fail", message: `No match for customer_id ${id}`, doc: {} }

        const customerDetails = { firstname: matchedDocument.firstName, lastname: matchedDocument.lastName, email: matchedDocument.email };

        return { status: "Success", message: `Document match for customer_id ${id}`, doc: customerDetails };
    }
    catch (error) {
        logError(error, "/users/share-file", "getCustomerDetails");
        return { status: "Fail", message: "Server Error", doc: {} }
    }
}

const validTypes = ["images", "docs", "pdfs"];

const getFilepath = (filename = '', type = '') => {

    if (typeof filename !== "string" || filename.length === 0) return "Invalid Filename";
    if (typeof type !== "string" || type.length === 0 || !validTypes.includes(`${type}`)) return "Invalid type";

    return path.join(__dirname, "..", "AT-FS", `${type.toLowerCase()}`, `store_${type}`, filename);
}


const getFileObject = async (id) => {
    if (typeof id !== "string" || !isValidObjectId(id)) return { status: "Fail", message: `Invalid Object Id ${id}`, doc: {} };
    const matchTypes = { "Image File": 'images', "PDF document": 'pdfs', "Word Document": 'docs' };

    try {
        const matchedDocument = await file.findOne({ _id: id });
        if (!matchedDocument) return { status: "Fail", message: `No match for file_id ${id}`, doc: {} }

        const fileDetails = { filename: matchedDocument.originalname, size: matchedDocument.file_size, path: getFilepath(matchedDocument.filename, matchTypes[matchedDocument.type] || undefined) };

        return { status: "Success", message: `Document match for file_id ${id}`, doc: fileDetails };
    }
    catch (error) {
        logError(error, "/users/share-file", "getFileDetails");
        return { status: "Fail", message: "Server Error", doc: {} }
    }
}

module.exports.shareFileController = async (req, res) => {
    const { id, message, receipients, user_id } = req.body;
    const validReceipientEmails = Array.isArray(receipients) ? receipients.filter((receipient) => (emailregexp.test(receipient))) : [];
    const invalidRecientEmails = Array.isArray(receipients) ? receipients.filter((receipient) => (!emailregexp.test(receipient))) : [];

    if (validReceipientEmails.length === 0) return res.status(400).json({ message: "Invalid receipient emails" })

    try {
        const sender = await getCustomerDetails(user_id);
        if (sender.status === "Fail") return res.status(404).json({ "message": sender.message, invalidRecientEmails });

        const fileItem = await getFileObject(id);
        if (fileItem.status === "Fail") return res.status(404).json({ "message": fileItem.message, invalidRecientEmails });

        const responseFromMailer = await mailer.sendFilesViaEmail([fileItem.doc], validReceipientEmails, sender.doc.email, message);
        console.log(responseFromMailer)
        if (responseFromMailer.state === "Failed") {
            return res.status(400).json({ message: responseFromMailer.message, invalidRecientEmails });
        }

        //update fileDocuments [ mailed property ]

        return res.status(200).json({ message: "Email sent successfully", invalidRecientEmails });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An unexpected error occured" });
    }
}