const container_main = getId("container-main");
const email_form = getId("email-form");
const verification_code_form = getId("verification-code-form");
const set_new_password_form = getId("set-new-password-form");

const constructEmailVerificationUrl = (email) => (EMAIL_REGEXP.test(email)) ? `/recovery/verify-email/${encodeURIComponent(email)}` : undefined;

const constructCodeVerificationUrl = (code_id, code, email) => (validCodeRegexp.test(code) && EMAIL_REGEXP.test(email)) ? `/recovery/verify-code?cid=${encodeURIComponent(code_id)}&code=${encodeURIComponent(code)}&email=${encodeURIComponent(email)}` : undefined;


const recoveryMain = async () => {

}

document.addEventListener("DOMContentLoaded", recoveryMain);