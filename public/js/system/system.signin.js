const signIn = async (username = "", password = "") => {
    const request_options = { username, password };
    const postSigninURL = '/users/login';
    const response = await initiatePostRequest(postSigninURL, request_options);

    if (response.status !== 200) {
        Toast_Notification.showError("Invalid username or password");
        return null;
    }

    return response.doc;
}

const signUp = async (email = "") => {
    const request_options = { email };
    const postSigninURL = '/users/signup/initiate';
    const response = await initiatePostRequest(postSigninURL, request_options);

    if (response.status !== 200) {
        Toast_Notification.showInfo("An error occured");
        return null;
    }

    Toast_Notification.showSuccess("A verification code has been sent to your email.");
    return response.doc;

}

const sendVerificationRequest = async (options = {}) => {
    const request_options = options;
    const postSigninURL = '/users/signup/verify-code';
    const response = await initiatePostRequest(postSigninURL, request_options);

    if (response.status === 409) {
        Toast_Notification.showError("Invalid code");
        return null;
    }

    Toast_Notification.showSuccess("A verification code has been sent to your email.");
    return response.doc;
}

const signupWithEmailAndPassword = async (email, password) => {
    const request_options = { email, user_password: password };
    const postSigninURL = '/users/signup/set-password';
    const response = await initiatePostRequest(postSigninURL, request_options);

    if (response.status !== 200) {
        Toast_Notification.showError("Invalid code");
        return null;
    }

    Toast_Notification.showSuccess("Account creation complete");
    return response.doc;
}
const renderVerificationForm = (codeId) => {
    let container_main = getId("container-main");
    container_main.innerHTML = "";
    container_main.innerHTML = verificationCodeForm;

    const validCodeRegexp = /^[A-Za-z0-9]{6}$/;

    container_main.querySelector("#code").addEventListener("input", (e) => {
        if ((validCodeRegexp.test(e.target.value))) {
            container_main.querySelector("#code-btn").removeAttribute("disabled");
            container_main.querySelector("#code-btn").classList.add("enabled");

            container_main.querySelector("#code-form-signup").addEventListener("submit", async (e) => {
                e.preventDefault();

                const input_code = container_main.querySelector("#code").value;

                const res = await sendVerificationRequest({ codeId, user_input: input_code });

                if (res.message === "Invalid Code") {
                    container_main.querySelector("#resend-code").classList.remove("hidden");
                    container_main.querySelector("#resend-code").addEventListener("click", async () => {
                        const user_email = JSON.parse(localStorage.getItem("session_email")) || null;

                        if (!user_email) {
                            Toast_Notification.showWarning("No valid Email was entered");
                            container_main.querySelector("#resend-code").innerHTML = '<a href="/signin">Back to sign in</a>';
                        }
                        else {
                            signUp(user_email).then((res) => {
                                renderVerificationForm(res.id);
                            }).catch(error => {
                                Toast_Notification.showError("An error occured: " + error.message);
                                location.reload();
                            })
                        }
                    })
                }
                else {
                    container_main.innerHTML = "";
                    container_main.innerHTML = addPasswordForm;

                    const passwordRegexp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#!._@-])[A-Za-z0-9#!._@-]{8,}$/;

                    container_main.querySelector("#password-btn").removeAttribute("disabled");
                    container_main.querySelector("#password-btn").classList.add("enabled");

                    container_main.querySelector("#password_input").addEventListener("input", (e) => {
                        if (passwordRegexp.test(e.target.value)) {
                            container_main.querySelector("#password-btn").removeAttribute("disabled");
                            container_main.querySelector("#password-btn").classList.add("enabled");

                            container_main.querySelector("#password-form-signup").addEventListener("submit", async (e) => {
                                e.preventDefault()
                                const user_input = container_main.querySelector("#password_input").value;
                                const email = JSON.parse(window.sessionStorage.getItem("session_email")) || null;
                                console.log(email)
                                console.log(window.sessionStorage.getItem("session_email"))

                                if (!email) {
                                    Toast_Notification.showError("An error occured. Please Try again");
                                }
                                else {
                                    const res = await signupWithEmailAndPassword(email, user_input);
                                    window.sessionStorage.setItem("user_data", JSON.stringify(res.user));
                                    window.sessionStorage.setItem("session-user", JSON.stringify(res.user.id));
                                    location.href = `/store`;
                                }
                            });
                        }
                        else {
                            container_main.querySelector("#password-btn").setAttribute("disabled", "true");
                            container_main.querySelector("#password-btn").classList.remove("enabled");
                            container_main.querySelector("#password-form-container").addEventListener("submit", (e) => e.preventDefault())
                        }
                    });



                }

            });
        }
        else {
            container_main.querySelector("#code-btn").setAttribute("disabled", "true");
            container_main.querySelector("#code-btn").classList.remove("enabled");
            container_main.querySelector("#code-form-signup").addEventListener("submit", (e) => e.preventDefault())
        }
    })


}

const signinMain = () => {
    const signinForm = getId("signin-form-signin-with-username");
    signinForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = getId("username").value;
        const password = getId("password").value;

        // console.log({ username, password });
        const res = await signIn(username, password);
        if (res.message === "success") {
            window.sessionStorage.setItem("user_data", JSON.stringify(res.user));
            window.sessionStorage.setItem("session-user", JSON.stringify(res.user.id));
            window.location.href = `/store`;
        }
    });

    const signupForm = getId("signin-form-signup");
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        getId("signup-btn").style.backgroundColor = "#0000009f";
        getId("signup-btn").style.color = "#fff";
        getId("signup-btn").style.border = "1px solid #0000009f";
        getId("signup-btn").setAttribute("disabled", "true");


        const email = getId("email").value;

        window.sessionStorage.setItem("session_email", JSON.stringify(email));
        console.log({ email });
        const res = await signUp(email);

        renderVerificationForm(res.id);
    });

}

document.addEventListener("DOMContentLoaded", signinMain);