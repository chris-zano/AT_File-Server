const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    console.log("password to be hashed = ",password)
    try {
        const salt = await bcrypt.genSalt(10);
        console.log("salt to be used = ",salt)
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Hased result = ", { salt, hashedPassword, error: null })
        return { salt, hashedPassword, error: null };
    }catch(error) {
        console.log(error);
        return {salt: null, hashedPassword: null, error: error}
    }
}

const comparePassword = async (password, hashedPassword) => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}


module.exports = { hashPassword, comparePassword };