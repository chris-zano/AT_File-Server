const signinMain = () => {
    const usernameForm = getId("signin-form-signin-with-username");
    usernameForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = getId("username").value;
        const password = getId("password").value;

        console.log({username, password});
    })
}

document.addEventListener("DOMContentLoaded", signinMain);