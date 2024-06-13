const user_id = JSON.parse(window.sessionStorage.getItem("session-user"));
const addToFavorites = async (button) => {
    const file_id = button.getAttribute("data-file_id");
    const url = new URL(`/users/add-to-favorites/${file_id}/${user_id}`);

    console.log(url)
}
const downloadFile =  (button) => {
    const file_path = button.getAttribute("data-file_path");
    const originalname = button.getAttribute("data-originalname");
    const filename = button.getAttribute("data-title");

    const downloadLink = document.createElement("a");
    downloadLink.href = file_path;
    downloadLink.download = `${filename.replaceAll(" ", "_")}${originalname.substring(originalname.lastIndexOf("."))}`; 
    downloadLink.click();
}
const shareFile = (button) => {
    const file_thumbnail = button.getAttribute("data-thumbnail");
    const file_title = button.getAttribute("data-title");
    const file_id = button.getAttribute("data-file_id");

    renderFileShareForm(file_id, file_title, file_thumbnail);
}

function renderFileShareForm(id, title, img) {
    const shareFormContainer = `
        <div class="form-container">
            <h2>Share File via Email</h2>
            <form id="emailForm">
                <label for="subject">Subject:</label>
                <input type="text" id="subject" name="subject" required>

                <label for="message">Message:</label>
                <textarea id="message" name="message" rows="4" required></textarea>

                <label for="email">Email:</label>
                <div class="email-input">
                    <input type="email" id="email" name="email" required>
                    <button type="button" id="addEmailBtn">Add Email</button>
                </div>

                <button type="submit">Share</button>
            </form>
        </div>
    `;

    document.getElementById("share-file_form_container").innerHTML = shareFormContainer;
    document.getElementById('addEmailBtn').addEventListener('click', function() {
        const emailInput = document.getElementById('email');
        if (emailInput.value && !emailInput.value.endsWith(';')) {
            emailInput.value += '; ';
            emailInput.focus()
        }
    });

    document.getElementById("emailForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const subject = document.target.querySelector("#")
    })

}