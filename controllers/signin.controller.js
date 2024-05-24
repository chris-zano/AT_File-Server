

const rou
const ADMIN_USERNAME_REGEXP = /^admin-[A-Za-z0-9]*$/;

module.exports.authenticateWithUsernameAndPassword = (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        res.status(400).end();
        return;
    }

    

}