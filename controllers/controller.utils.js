/**
 * @module controllerUtilities
 */

const randomstring = require("randomstring");
const crypto = require('crypto');

/**
 * Generates a temporary ID.
 * 
 * @function generateTempId
 * @returns {string} - A UUID.
 */
const generateTempId = () => {
    return crypto.randomUUID();
}

/**
 * Generates a verification code.
 * 
 * @function generateVerificationCode
 * @returns {string} - A 6-character alphanumeric verification code.
 */
const generateVerificationCode = () => {
    return randomstring.generate({
        length: 6,
        charset: 'alphanumeric'
    });
}

/**
 * Check if the matched request route include a string
 * 
 * @function matchBaseStringToSubstring
 * @param {string} baseString - the string to match
 * @param {string} subString - the string to match
 * @returns {Boolean} - returns true if there is a match otherwise returns false  
 */
const matchBaseStringToSubstring = (baseString = "", subString = "") => {
    return baseString.includes(subString);
}

module.exports = {
    generateTempId,
    generateVerificationCode,
    matchBaseStringToSubstring
}