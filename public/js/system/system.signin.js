const signIn = async (username = "", password = "") => {
    const request_options = {username, password};
    const postSigninURL = '/users/login';
    const response = await initiatePostRequest(postSigninURL, request_options);

    if (response.status !== 200) {
        Toast_Notification.showError("Invalid username or password");
        return null;
    }

    return response.json();

}

const signUp = async (email = "") => {
    const request_options = {email};
    const postSigninURL = '/users/signup/initiate';
    const response = await initiatePostRequest(postSigninURL, request_options);

    if (response.status !== 200) {
        Toast_Notification.showInfo("An error occured");
        return null;
    }

    Toast_Notification.showSuccess("A verification code has been sent");
    return response.json();

}

const signinMain = () => {

    const signInWithEmailBtn = getId("sign-in-with-email-btn");
    const signInWithUsernameBtn = getId("sign-in-with-username-btn");

    signInWithEmailBtn.addEventListener("click", (e) => {
        const emailFormContainer = getId("email-form-container");
        const usernameFormContainer = getId("username-form-container");

        if (emailFormContainer.classList.contains("hidden")) {
            usernameFormContainer.classList.add("hidden");
            emailFormContainer.classList.remove("hidden");
        }
    });

    signInWithUsernameBtn.addEventListener("click", (e) => {
        const emailFormContainer = getId("email-form-container");
        const usernameFormContainer = getId("username-form-container");

        if (usernameFormContainer.classList.contains("hidden")) {
            emailFormContainer.classList.add("hidden");
            usernameFormContainer.classList.remove("hidden");
        }
    });

    const signinForm = getId("signin-form-signin-with-username");
    signinForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = getId("username").value;
        const password = getId("password").value;

        // console.log({ username, password });
        const res = await signIn(username, password);
        console.log(res);
    });

    const signupForm = getId("signin-form-signup");
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = getId("email").value;

        console.log({ email });
        const res = await signUp(email);
        console.log(res);
    });

}

document.addEventListener("DOMContentLoaded", signinMain);