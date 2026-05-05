const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");


const forgetMail = async ({ to, subject, replacements, template }) => {

    const filePath = path.join(__dirname, `../Templates/resetpasswordemail.html`);

    let html = fs.readFileSync(filePath, "utf-8");

    Object.keys(replacements).forEach(key => {
        html = html.replace(new RegExp(`{{${key}}}`, "g"), replacements[key]);
    });

    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM}>`,
        to,
        subject,
        html
    });
};

module.exports = forgetMail;