const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const sendContactMail = async ({ to, subject, replacements }) => {
    // const filePath = path.join(__dirname, "../templates/contactEmail.html");
    const filePath = path.join(process.cwd(), "templates/contactEmail.html");
    let html = fs.readFileSync(filePath, "utf-8");

    Object.keys(replacements).forEach((key) => {
        const value = replacements[key] ?? "-";
        html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
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
        html,
    });
};

module.exports = sendContactMail;