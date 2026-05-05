const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const sendMail = async ({ to, subject, replacements }) => {
    const filePath = path.join(__dirname, "../templates/welcomeEmail.html");
    // const filePath = path.join(process.cwd(), "templates/welcomeEmail.html");
    console.log("__dirname:", __dirname);
    console.log("cwd:", process.cwd());
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

module.exports = sendMail;