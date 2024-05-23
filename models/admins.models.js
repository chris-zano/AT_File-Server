const { getDatabase } = require("../utils/monogdb.connect");
const { hashPassword, comparePassword } = require("../utils/password.utils");
let admin_collection;
getDatabase().then((db) => {
    admin_collection = db.collection("admins");
});

class Admins {
    constructor(email, password) {
        this._email = email;
        this.password = password;
    }

    async save() {
        const { salt, hashedPassword } = hashPassword(this.password);

        const newAdmin = {
            username: "systemAdmin" + new Date().getMilliseconds(),
            email: this._email,
            password: hashedPassword,
            salt: salt
        };

        try {
            const savedAdmin = await admin_collection.insertOne(newAdmin);
            const { password, ...rest } = savedAdmin;
            return rest;

        } catch (error) {
            throw new Error("Failed to save admin")
        }
    }

    static async validateAdminId(admin_id) {
        const verifiedAdmin = await admin_collection.findOne({ _id: admin_id });
        if (!verifiedAdmin) {
            return {
                operationStatus: "Fail",
                userObject: {}
            };
        }

        return {
            operationStatus: "Success",
            userObject: verifiedAdmin
        };
    }

    static async verifyAdminUsernameAndPassword(username = "", user_password = "", verifyUserBy = "username") {
        let userQueryKey = verifyUserBy;

        if (!username || !user_password || !verifyUserBy) {
            return {
                operationStatus: "Fail",
                userObject: {}
            };
        }

        const userMatch = await admin_collection.findOne({ [userQueryKey]: username });

        if (!userMatch || Object.keys(userMatch).length === 0) {
            return {
                operationStatus: "Fail",
                userObject: {}
            };
        }

        const isUserPasswordValid = await comparePassword(user_password, userMatch.password);

        if (!isUserPasswordValid) {
            return {
                operationStatus: "Fail",
                userObject: {}
            };
        }

        const { password: _, ...rest } = userMatch;
        return {
            operationStatus: "Success",
            userObject: rest
        }
    }

    static async usernameExists(username = "", verifyUsernameBy = "username") {
        const userQueryKey = verifyUsernameBy;

        if (!username || !verifyUsernameBy) {
            return {
                operationStatus: "Fail",
                isMatch: false
            }
        }

        const userMatch = await admin_collection.findOne({ [userQueryKey]: username });

        if (!userMatch) {
            return {
                operationStatus: "Fail",
                isMatch: false
            }
        }

        if (Object.keys(userMatch).length === 0) {
            return {
                operationStatus: "No match",
                isMatch: false
            }
        }

        return {
            operationStatus: "username already exists",
            isMatch: true
        }

    }

    static async updateUserCredential(credential_key = "username", credential_value = "", user_id = "") {
        const userQueryKey = credential_key;

        if (!credential_key || !credential_value || !user_id) {
            return {
                operationStatus: "Fail",
                userObject: {}
            }
        }

        const userMatch = await admin_collection.updateOne(
            { _id: user_id },
            {
                $set: {
                    [userQueryKey]: credential_value
                }
            }
        );

        if (userMatch) {
            return {
                operationStatus: "Success",
                userObject: userMatch
            }
        }

        return {
            operationStatus: "Fail",
            userObject: {}
        }

    }

}

module.exports = Admins