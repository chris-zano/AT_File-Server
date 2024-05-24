const adminsModel = require("../models/admins.model");
const customersModel = require("../models/customers.model");

const Admins = () => adminsModel;
const Customers = () => customersModel;

module.exports = { Admins, Customers};