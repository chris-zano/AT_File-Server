const { Customers } = require("../utils/db.exports.utils");
const { hashPassword, comparePassword } = require("../utils/password.utils");



module.exports.authenticateWithUsernameAndPassword = async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        res.status(400).end();
        return;
    }

    const userMatch = await Customers.findOne({username: username});

    if (Object.keys(userMatch).length === 0 || !userMatch) {
        res.status(404).json({message: "User not found"});
        return;
    }

    const passwordIsMatch = await comparePassword(password, userMatch.password);

    if (!passwordIsMatch) {
        res.status(404).json()
        return;
    }

    res.status(200).json({message: "success", user: userMatch});

}