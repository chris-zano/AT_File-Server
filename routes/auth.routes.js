const express = require('express');
const adminsModel = require('../models/admins.model');
const customersModel = require('../models/customers.model');
const codesModel = require('../models/codes.model');
const { logError } = require('../utils/logs.utils');
const { verifyAdminbyId } = require('../utils/users.verify.utils');
const { alertUserOfPasswordResetAttempt, informUserOfSuccessfulPasswordReset, emailRegexp } = require('../utils/mailer.utils');
const { hashPassword, comparePassword } = require('../utils/password.utils');
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
            const mailedResponse = await alertUserOfPasswordResetAttempt(doc.verified_user.email, doc.verified_user.username, doc.verified_user._id, user_permission === "admin" ? "system-undefined" : "system-not-null");

            if (mailedResponse.messageId && mailedResponse.recipient_email.length !== 0) {
                return res.status(200).json({ message: "A password reset link has been sent to your email." });
            }
            else {
                return res.status(500).json({ message: "An unexpected error occured. Please try again later." })
            }
        }

        throw new Error;
    } catch (error) {
        //for debugging 
        console.error("Error on line 101: ", error);

        logError(error, req.path(), `GET ${req.path()}`);
        res.render("error", { code: 500, message: `An Unexpected error occured` })
    }
});


router.get('/sessions/reset-user-password/:user/:id', async (req, res) => {
    const { user, id } = req.params;
    const GetUserTypes = { "system-undefined": adminsModel, "system-not-null": customersModel };
    const InvokeUserTypeReference = GetUserTypes[user];

    if (!InvokeUserTypeReference) {
        return res.render("error", { code: 403, message: `Forbidden. You are not authorised to access this resource` });
    }

    const userObject = await InvokeUserTypeReference.findOne({ _id: id });

    if (!userObject || Object.keys(userObject).length === 0) {
        return res.render("error", {
            code: 404,
            message: `User Not found`
        });
    }

    return res.render("accounts/password-reset", {
        id: userObject._id,
        email: userObject.email,
        permission: user,
        error: "empty"
    });
});

router.post("/session/password-reset/", async (req, res) => {
    const { user_type, email, userId, password } = req.body;
    const passwordRegexp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#!._@-])[A-Za-z0-9#!._@-]{8,}$/;

    const isValidUserType = (user_type === "system-undefined" || user_type === "system-not-null");
    const isValidEmail = emailRegexp().test(email);
    const isValidUserId = typeof userId === 'string' && userId.trim().length > 0; // userId should be a non-empty string
    const isValidPassword = passwordRegexp.test(password);

    if (!(isValidUserType && isValidEmail && isValidUserId)) {

        return res.render("error", {
            code: 400,
            message: `An unexpected error occured.`
        });
    }
    if (!(isValidPassword)) {
        return res.render("accounts/password-reset", {
            id: userId,
            email: email,
            permission: user_type,
            error: "Invalid Password Format"
        });
    }

    const GetUserTypes = {
        "system-undefined": adminsModel,
        "system-not-null": customersModel
    };

    const InvokeUserTypeReference = GetUserTypes[user_type];

    if (!InvokeUserTypeReference) {
        return res.render("error", {
            code: 403,
            message: `Forbidden. You are not authorised to access this resource`
        });
    }

    try {
        const hashedPassword = await hashPassword(password);
        const updatePassword = await InvokeUserTypeReference.updateOne({ _id: userId, email: email }, {
            $set: {
                password: hashedPassword.hashedPassword,
                password_salt: hashedPassword.salt
            }
        });

        if (!(updatePassword.acknowledged) && !(updatePassword.modifiedCount === 1)) {
            return res.render("error", { code: 403, message: `Forbidden. You are not authorised to access this resource` });
        }

        //send confirmation email to user
        await informUserOfSuccessfulPasswordReset(email);

        return res.render("accounts/password-changed", { userType: user_type });
    }
    catch (error) {
        //log errors with the developer logError module
        logError(error, "/session/password-reset/", "callback");

        console.error(error);
        return res.render("error", {
            code: 500,
            message: `An unexpected error occured`
        });
    }
});


module.exports = router;