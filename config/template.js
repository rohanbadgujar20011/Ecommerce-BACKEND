exports.resetEmail = (host, resetToken) => {
    const message = {
        subject: 'Reset Password',
        text:
            `${'You are receiving this because you have requested to reset your password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://'
            }${host}/reset-password/${resetToken}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    return message;
};