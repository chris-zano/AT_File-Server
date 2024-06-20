const { Customers, Files } = require('../utils/db.exports.utils');
const { logError } = require('../utils/logs.utils');
const mailer = require('../utils/mailer.utils');
const emailregexp = mailer.emailRegexp();
const mongoose = require('mongoose');
const path = require('path');
const fs = require("fs");
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
    try {
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
    } catch (error) {
        logError(error, "run updates", "runUpdates");
    }
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

            const responseFromMailer = await mailer.sendFilesViaEmail([fileItem.doc], validRecipientEmails, sender.doc.email, message);

            if (responseFromMailer.state === "Failed") {
                await file.updateOne(
                    { id: id, "shared._id": sharedId },
                    { $set: { "shared.$.status": "failed" } }
                );
                return;
            }

            await runUpdates(id, sharedId, user_id, responseFromMailer);
        } catch (error) {
            console.log(error);
            logError(error, "/users/share-file", "queueRequestForProcessisng");
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

module.exports.addToFavorites = async (req, res) => {
    const { file_id, user_id } = req.body;

    if (!(isValidObjectId(file_id) && isValidObjectId(user_id))) {
        return res.status(400).json({ message: "Invalid file or object ids" });
    }

    try {
        await customer.updateOne({ _id: user_id }, {
            $push: { favourites: file_id }
        });

        return res.status(200).json({ message: "success" });

    } catch (error) {
        logError(error, req.url, "addToFavorites");
        return res.status(500).json({ message: "An unexpected error occured" });
    }
}

module.exports.addToDownloads = async (req, res) => {
    const { file_id, user_id } = req.body;

    if (!(isValidObjectId(file_id) && isValidObjectId(user_id))) {
        return res.status(400).json({ message: "Invalid file or object ids" });
    }

    try {
        await file.updateOne({ _id: file_id }, {
            $push: { downloads: user_id }
        });

        await customer.updateOne({ _id: user_id }, {
            $push: { downloads: file_id }
        });

        return res.status(200).json({ message: "success" });

    } catch (error) {
        logError(error, req.url, "addToFavorites");
        return res.status(500).json({ message: "An unexpected error occured" });
    }
}

module.exports.updateProfilePicture = async (req, res) => {
    const { id } = req.verifiedUser;
    const { filename } = req.file;
    const { old_filename } = req.params;

    if (old_filename !== "null") {
        try {
            const current_userImagePath = path.join(__dirname, "..", "AT-FS", "images", "profile_pictures", old_filename);
            if (fs.existsSync(current_userImagePath)) fs.rm(current_userImagePath, (console.error))
        } catch (error) {
            logError(error, req.url, "updateProfilePicture~ delete_current_profilePicture");
            return res.status(500).redirect(`/users/views/profile/${id}`);
        }
    }

    try {
        const profilePicURL = `/files/users/images/profilePicurl/${filename}`
        await customer.updateOne({ _id: id }, {
            $set: {
                profilePicURL: profilePicURL
            }
        });

        return res.status(200).redirect(`/users/views/profile/${id}`);
    }
    catch (error) {
        logError(error, req.url, "updateProfilePicture");
        return res.status(500).redirect(`/users/views/profile/${id}`);
    }

}

module.exports.updateCustomerDetails = async (req, res) => {
    const { id, v } = req.params;
    const { firstname, lastname, username } = req.body;

    if (!isValidObjectId(id) || !v) {
        return res.status(400).render('error', { code: 400, message: "An error occured while processing your request" });
    }

    try {
        await customer.findOneAndUpdate({ _id: id, __v: v }, {
            $set: {
                firstName: firstname,
                lastName: lastname,
                username: username
            }
        });

        return res.status(200).redirect(`/users/views/profile/${id}`);

    } catch (error) {
        logError(error, req.url, "updateCustomerDetails");
        return res.status(500).render({ code: 500, message: "Internal Server Error" });
    }
}