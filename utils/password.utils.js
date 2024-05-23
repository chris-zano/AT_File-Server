const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const salt = bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return {salt, hashedPassword};
}

const comparePassword = async(password, hashedPassword) => {
    const isMatch =  await bcrypt.compare(password, hashedPassword); 
    return isMatch;
}


module.exports = {hashPassword, comparePassword};