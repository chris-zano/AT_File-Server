const signIn = async (username = "", password = "") => {
    const request_options = {username, password};
    const postSigninURL = '/users/signin/sign-in-with-username-and-password';
    const response = await initiatePostRequest(postSigninURL, request_options);

    console.log(response);

}

const signUp = async (email = "") => {
    const request_options = {email};
    const postSigninURL = '/users/signin/sign-up-with-email';
    const response = await initiatePostRequest(postSigninURL, request_options);

    console.log(response);

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

        console.log({ username, password });
    });

    const signupForm = getId("signin-form-signup");
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = getId("email").value;

        console.log({ email });
    });

}

document.addEventListener("DOMContentLoaded", signinMain);