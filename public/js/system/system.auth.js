const verifyUserCredentials = async (user_id, permissions) => {
    const url = `/system/verify-user/${permissions}/${user_id}`;

    try {
        console.log(url);
        const data = await initiateGetRequest(url);
        console.log(data);
        return data;
    }catch(error) {
        console.log(error);
        return null
    }


}

const auth_main = async () => {
    const userId = JSON.parse(window.sessionStorage.getItem("session-user"));
    const adminId = JSON.parse(window.sessionStorage.getItem("session-admin"));
    let response;

    if (userId && adminId) {
        window.sessionStorage.clear();
        window.location.href = "/signin";
    }

    else {
        if (userId && !adminId) {
            response = await verifyUserCredentials(userId._id, "users");
        }
        else if (!userId && adminId) {
            console.log("here")
            response = await verifyUserCredentials(adminId._id, "admins");
        }
        else {
            console.log(adminId);
            console.log(userId);
        }
    }

}

document.addEventListener("DOMContentLoaded", auth_main);