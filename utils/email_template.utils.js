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

function createEmailTemplateForPasswordResetAttempt(receipient_email, username, userId, admin) {
    const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Password Reset</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border: 1px solid #dddddd;
                border-radius: 5px;
                overflow: hidden;
            }
            .header {
                background-color: #007bff;
                color: #ffffff;
                padding: 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
            }
            .content {
                padding: 20px;
            }
            .content p {
                font-size: 16px;
                line-height: 1.6;
                color: #333333;
            }
            .button {
                display: block;
                width: 200px;
                margin: 20px auto;
                padding: 10px;
                background-color: #007bff;
                color: #ffffff;
                text-align: center;
                text-decoration: none;
                border-radius: 5px;
            }
            .footer {
                background-color: #f4f4f4;
                color: #999999;
                padding: 10px;
                text-align: center;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset Request</h1>
            </div>
            <div class="content">
                <p>Hello ${username},</p>
                <p>We received a request to reset your password for yout AT File Server account with email ${receipient_email}</p>
                <p>Click the button below to reset it.</p>
                <a href="/sessions/reset-user-password/${encodeURIComponent(admin)}/${encodeURIComponent(userId)}" class="button">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email or contact support if you have any questions.</p>
                <p>Thank you,<br>AT-File Server</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 AT-File Server. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
`;
}

module.exports = { createEmailTemplateForVerificationCode, createEmailTemplateForPasswordResetAttempt }
