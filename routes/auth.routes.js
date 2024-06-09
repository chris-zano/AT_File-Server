const express = require('express');
const adminsModel = require('../models/admins.model');
const customersModel = require('../models/customers.model');
const codesModel = require('../models/codes.model');
const { logError } = require('../utils/logs.utils');
const { verifyAdminbyId } = require('../utils/users.verify.utils');
const { alertUserOfPasswordResetAttempt } = require('../utils/mailer.utils');
const router = express.Router();

router.get("/system/verify-user/:permissions/:id", async (req, res) => {
    const { permissions, id } = req.params;

    if (!permissions || !id) {
        res.status(400).json({ messaage: "Invalid request" });
        return;
    }

    if (permissions === "admins") {
        try {
            const isAdmin = await adminsModel.findOne({ _id: id });
            if (isAdmin) {
                res.set("Cache-Control", "public, max-age=3600");
                res.status(200).json({ message: "valid admin" });
            }
            else {
                res.set("Cache-Control", "public, max-age=3600");
                res.status(404).json({ message: "user not found" });
            }
        }
        catch (error) {
            logError(error, `/system/verify-user/${req.params.permissions}/${req.params.id}`, `router.get(req, res)`);
            res.render("error", { code: "500", message: "The system failed to verify your credentials" });
        }
    }

    else if (permissions === "users") {
        const isCustomer = await customersModel.findOne({ _id: id });

        if (isCustomer) {
            res.set("Cache-Control", "public, max-age=3600");
            res.status(200).json({ message: "valid customer" });
        }

        else {
            res.set("Cache-Control", "public, max-age=3600");
            res.status(404).json({ message: "user not found" });
        }

        return;
    }

    else {
        res.status(500).json("Internal Server Error");
    }
});

const verifyAdminByIdAndEmail = async (uid, uemail) => {
    const matchedDocument = await adminsModel.findOne({ _id: uid, email: uemail });

    if (!matchedDocument) throw new Error("Admin not found");

    return { verified_user: matchedDocument };
}

const verifyCustomerByIdAndEmail = async (uid, uemail) => {
    const matchedDocument = await customersModel.findOne({ _id: uid, email: uemail });

    if (!matchedDocument) return false;

    return { verified_user: matchedDocument };
}

router.get('/sessions/:user_permission/password-reset', async (req, res) => {
    const { user_permission } = req.params;
    const { uid, uemail } = req.query;

    if (!uid || !uemail) return res.status(403).redirect(user_permission === "admin" ? '/admin/signin' : '/signin');

    var verifyUserByPermission = { 'admin': verifyAdminByIdAndEmail, 'customer': verifyCustomerByIdAndEmail };
    var userPermissionMatch = verifyUserByPermission[user_permission];

    if (!userPermissionMatch) return res.status(403).render("error", { code: 403, message: `Operation requires authentication` });

    try {
        const doc = await userPermissionMatch(uid, uemail);

        if (doc && Object.keys(doc).length !== 0) {
            const mailedResponse = await alertUserOfPasswordResetAttempt(doc.email, doc.username, doc._id, user_permission === "admin" ? "system-undefined" : "system-not-null");

            if (mailedResponse.messageId && mailedResponse.receipient_email.length !== 0) {
                return res.status(200).json({message: "A password reset link has been sent to your email."});
            }
            else {
                return res.status(500).json({message: "An unexpected error occured. Please try again later."})
            }
        }

        throw new Error;
    } catch (error) {
        //for debugging 
        console.error("Error on line 101: ",error);

        logError(error, req.path(), `GET ${req.path()}`);
        res.render("error", { code: 500, message: `An Unexpected error occured` })
    }
});



module.exports = router;