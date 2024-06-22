const verifyUserCredentials = async (user_id, permissions) => {
    const url = `/system/verify-user/${permissions}/${user_id}`;

    try {
        const data = await fetch(url);
        return await data.json();
    } catch (error) {
        window.location.replace(`/error/400/${encodeURIComponent(url)}/${encodeURIComponent(error)}`);
    }

    return;
}

const auth_main = async () => {
    const userId = JSON.parse(window.sessionStorage.getItem("session-user")) || undefined;
    const adminId = JSON.parse(window.sessionStorage.getItem("session-admin")) || undefined;


    /*
    let response;
    if (userId && adminId) {
        window.sessionStorage.clear();
        window.location.href = "/signin";
    }

    else {
        if (userId && !adminId) {
            response = await verifyUserCredentials(userId, "users");
        }
        else if (!userId && adminId) {
            response = await verifyUserCredentials(adminId, "admins");
        }
        else {
            window.sessionStorage.clear();
            window.location.href = "/admin/signin";
        }
    }
    */

}

document.addEventListener("DOMContentLoaded", auth_main);