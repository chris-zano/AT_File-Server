const { Customers, Files } = require('../utils/db.exports.utils');
const { logError } = require('../utils/logs.utils');
const mailer = require('../utils/mailer.utils');
const emailregexp = mailer.emailRegexp();
const mongoose = require('mongoose');
const path = require('path');
const file = Files();
const customer = Customers();


// check if an id is a valid MongoDB ObjectId
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

const getCustomerDetails = async (id) => {
    if (typeof id !== "string" || !isValidObjectId(id)) return { status: "Fail", message: `Invalid Object Id ${id}`, doc: {} };
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

const runUpdates = async (id, sharedId, user_id, responseFromMailer) => {
    await file.updateOne(
        { _id: id, "shared._id": sharedId },
        { $set: { "shared.$.status": "success" } }
    );

    await file.updateOne(
        { _id: id, "shared._id": sharedId },
        { $push: { "shared.$.recipients": { $each: responseFromMailer.recipients } } }
    );

    await customer.findOneAndUpdate({ _id: user_id }, {
        $push: { mailed: id }
    });
}

const queueRequestForProcessisng = (id, user_id, sharedId, validRecipientEmails, message) => {
    setTimeout(async () => {
        try {
            const sender = await getCustomerDetails(user_id);
            const fileItem = await getFileObject(id);

            if ((fileItem.status === "Fail") || (sender.status === "Fail")) {
                await file.updateOne(
                    { id: id, "shared._id": sharedId },
                    { $set: { "shared.$.status": "failed" } }
                );
                return;
            }

            try {
                const responseFromMailer = await mailer.sendFilesViaEmail([fileItem.doc], validRecipientEmails, sender.doc.email, message);

                if (responseFromMailer.state === "Failed") {
                    await file.updateOne(
                        { id: id, "shared._id": sharedId },
                        { $set: { "shared.$.status": "failed" } }
                    );
                    return;
                }

                await runUpdates(id, sharedId, user_id, responseFromMailer);
            } catch (mailerError) {
                console.log(mailerError);
                logError(mailerError, null, "queueRequestForProcessisng");
                await file.updateOne(
                    { id: id, "shared._id": sharedId },
                    { $set: { "shared.$.status": "failed" } }
                );
            }
        } catch (error) {
            console.log(error);
            logError(error, req.url, "queueRequestForProcessisng");

            try {
                await file.updateOne(
                    { id: id, "shared._id": sharedId },
                    { $set: { "shared.$.status": "failed" } }
                );
            } catch (updateError) {
                console.log(updateError);
                logError(updateError, "Error update mailer status", "queueRequestForProcessisng");
            }
        }
    }, 0);
};

module.exports.shareFileController = async (req, res) => {
    const { id, message, recipients, user_id } = req.body;
    const validRecipientEmails = Array.isArray(recipients) ? recipients.filter((recipient) => (emailregexp.test(recipient))) : [];
    const invalidRecipientEmails = Array.isArray(recipients) ? recipients.filter((recipient) => (!emailregexp.test(recipient))) : [];

    if (validRecipientEmails.length === 0) return res.status(400).json({ message: "Invalid recipient emails" })

    res.status(202).json({ message: "Request is been processed", invalidRecipientEmails });
    const updatedFile = await file.findOneAndUpdate(
        { _id: id },
        {
            $push: {
                shared: {
                    from: user_id,
                    recipients: recipients,
                    status: "pending"
                }
            }
        },
        { new: true, useFindAndModify: false }
    );
    const sharedObj = updatedFile.shared[updatedFile.shared.length - 1]
    const sharedId = sharedObj._id;

    queueRequestForProcessisng(id, user_id, sharedId, validRecipientEmails, message);
}