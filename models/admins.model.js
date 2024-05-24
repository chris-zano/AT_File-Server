const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    password_salt: {
        type: String,
        required: true
    },
    username: {
        type: String,
        default:""
    },
    profilePicURL: {
        type: String,
        default:""
    }
},{timestamps: true});

module.exports = mongoose.model("Admins", adminSchema);