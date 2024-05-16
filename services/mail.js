const nodemailer = require('nodemailer')
const keys = require('../config/keys')
const template = require('../config/template')

const { mail } = keys;

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: mail.email,
        pass: mail.password,
    },
});
exports.sendEmail = async (email, type, host, data) => {
    try {
        const message = prepareTemplate(type, host, data);


        const config = {
            from: `MERN Store! ${mail.email} `,
            to: email,
            subject: message.subject,
            html: message.text,
        };

        const info = await transporter.sendMail(config);
        return info;
    } catch (error) {
        console.log(error);
        return error;
    }
};

const prepareTemplate = (type, host, data) => {
    let message;

    switch (type) {
        case 'reset':
            message = template.resetEmail(host, data);
            break;

        case 'reset-confirmation':
            message = template.confirmResetPasswordEmail();
            break;

        case 'signup':
            message = template.signupEmail(data);
            break;

        case 'merchant-signup':
            message = template.merchantSignup(host, data);
            break;

        case 'merchant-welcome':
            message = template.merchantWelcome(data);
            break;

        case 'newsletter-subscription':
            message = template.newsletterSubscriptionEmail();
            break;

        case 'contact':
            message = template.contactEmail();
            break;

        case 'merchant-application':
            message = template.merchantApplicationEmail();
            break;

        case 'merchant-deactivate-account':
            message = template.merchantDeactivateAccount();
            break;

        case 'order-confirmation':
            message = template.orderConfirmationEmail(data);
            break;

        default:
            message = '';
    }

    return message;
};