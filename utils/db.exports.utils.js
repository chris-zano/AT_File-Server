const adminsModel = require("../models/admins.model");
const codesModel = require("../models/codes.model");
const customersModel = require("../models/customers.model");


const Admins = () => adminsModel;
const Customers = () => customersModel;
const Codes = () => codesModel;

module.exports = { Admins, Customers, Codes};