const emailSubmissionForm = document.getElementById("email-submission-form");
emailSubmissionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user_email_input = document.getElementById("email").value;

    if (EMAIL_REGEXP.test(user_email_input)) {
        console.info("Submit triggered for email verification at: ", user_email_input);

        const userPermissionStatus = document.querySelector('input[name="user_permission"').value || undefined;
        const emailMustMatch = document.querySelector('input[name="email_must_match"').value;
        const userIdMustMatch = document.querySelector('input[name="userId_must_match"').value
        const sessionId = JSON.parse(window.sessionStorage.getItem(`session-${userPermissionStatus}`));

        
        if( !(emailMustMatch === user_email_input) || !(sessionId === userIdMustMatch) ) {
            console.warn("Submit triggered for email verification at: ", user_email_input);
            alert("The provided email doesn't match the account email that initiated this sequence");
            
            //warn the user of an attempted password reset.
        }
    }
    else {
        console.warn("Submit triggered for email verification at: ", user_email_input);
    }

});