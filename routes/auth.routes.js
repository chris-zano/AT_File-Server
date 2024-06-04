const express = require('express');
const adminsModel = require('../models/admins.model');
const customersModel = require('../models/customers.model');
const { logError } = require('../utils/logs.utils');
const router = express.Router();

router.get("/system/verify-user/:permissions/:id", async (req, res) => {
    const { permissions, id } = req.params;

    if (!permissions || !id) {
        res.status(400).json({messaage: "Invalid request"});
        return;
    }

    if (permissions === "admins") {
        try {
            const isAdmin = await adminsModel.findOne({_id: id});
            if (isAdmin) {
                res.set("Cache-Control", "public, max-age=3600");
                res.status(200).json({message: "valid admin"});
            }
            else {
                res.set("Cache-Control", "public, max-age=3600");
                res.status(404).json({message: "user not found"});
            }
        }
        catch(error) {
            logError(error, `/system/verify-user/${req.params.permissions}/${req.params.id}`, `router.get(req, res)`);
            res.render("error", {code: "500", message: "The system failed to verify your credentials"});
        }
    }

    else if (permissions === "users") {
        const isCustomer = await customersModel.findOne({_id: id});

        if (isCustomer) {
            res.set("Cache-Control", "public, max-age=3600");
            res.status(200).json({message: "valid customer"});
        }

        else {
            res.set("Cache-Control", "public, max-age=3600");
            res.status(404).json({message: "user not found"});
        }

        return;
    }

    else {
        res.status(500).json("Internal Server Error");
    }
});

module.exports = router;