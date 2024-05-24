const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const codeSchema = new Schema({
    receipient_email: {
        type: String,
        required: true,
        unique:false,
    },
    code: {
        type: String,
        required: true
    },
    messageId: {
        type: String,
        default:""
    }
},{timestamps: true});

module.exports = mongoose.model("Codes", codeSchema);