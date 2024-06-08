const express = require('express');
const adminsModel = require('../models/admins.model');
const customersModel = require('../models/customers.model');
const { logError } = require('../utils/logs.utils');
const { verifyAdminbyId } = require('../utils/users.verify.utils');
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

    return { verified_user: true };
}

const verifyCustomerByIdAndEmail = async (uid, uemail) => {
    const matchedDocument = await customersModel.findOne({ _id: uid, email: uemail });

    if (!matchedDocument) return false;

    return true;
}

router.get('/sessions/:user_permission/password-reset', async (req, res) => {
    const { user_permission } = req.params;
    const { uid, uemail } = req.query;

    if (!uid || !uemail) return res.status(403).redirect(user_permission === "admin" ? '/admin/signin' : '/signin');

    var verifyUserByPermission = { 'admin': verifyAdminByIdAndEmail, 'customer': verifyCustomerByIdAndEmail };
    var userPermissionMatch = verifyUserByPermission[user_permission];

    if (!userPermissionMatch) return res.status(403).render("error", { code: 403, message: `Operation requires authentication` });

    try {
        const isUserValid = await userPermissionMatch(uid, uemail);
        if (isUserValid) return res.render('accounts/password-reset', { id: uid, email: uemail });

        throw new Error;
    } catch (error) {
        //for debugging 
        console.error(error);
        logError(error, req.path(), `GET ${req.path()}`);
        res.render("error", { code: 500, message: `An Unexpected error occured` })
    }
});

module.exports = router;