const adminsModel = require("../models/admins.model");
const codesModel = require("../models/codes.model");
const customersModel = require("../models/customers.model");
const fileModel = require("../models/files.model");


const Admins = () => adminsModel;
const Customers = () => customersModel;
const Codes = () => codesModel;
const Files = () => fileModel;

module.exports = { Admins, Customers, Codes, Files};