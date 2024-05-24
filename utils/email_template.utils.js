function createEmailTemplateForVerificationCode(verificationCode) {
    const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #007BFF;
                    color: #ffffff;
                    padding: 10px 0;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                    font-size: 16px;
                    line-height: 1.5;
                    color: #333333;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #777777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>${verificationCode}</h1>
                </div>
                <div class="content">
                    <p><bold>${verificationCode}</bold> is your AT-File Server verification code</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 AT-File Server. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
    return emailTemplate;
}

module.exports = { createEmailTemplateForVerificationCode }
