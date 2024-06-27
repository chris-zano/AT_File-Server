const verifyUserCredentials = async (user_id, permissions) => {
    const url = `/system/verify-user/${permissions}/${user_id}`;

    try {
        const data = await fetch(url);
        return { status: data.status, doc: await data.json() };
    } catch (error) {
        window.location.replace(`/error/400/${encodeURIComponent(url)}/${encodeURIComponent(error)}`);
    }
    return
}

const auth_main = async () => {
    const userId = JSON.parse(window.sessionStorage.getItem("session-user")) || undefined;
    const adminId = JSON.parse(window.sessionStorage.getItem("session-admin")) || undefined;
    
    
    if (userId && adminId) {
        window.alert("Session expired, redirecting to signin");
        window.sessionStorage.clear();
        return window.location.href = "/";
    }
    
    if (!userId && ! adminId) {
        window.alert("Session expired, redirecting to signin");
        window.sessionStorage.clear();
        return window.location.href = "/";
    }
    
    let response;
    if (userId) {
        response = await verifyUserCredentials(userId, "users");
    } else if (adminId) {
        response = await verifyUserCredentials(adminId, "admins");
    }

    if (response.status == 400 || response.status == 404) {
        window.alert("Session expired, redirecting to signin");
        window.sessionStorage.clear();
        return window.location.href = '/';
    }

    return;
}

document.addEventListener("DOMContentLoaded", auth_main);