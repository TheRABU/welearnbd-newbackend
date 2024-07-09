const nodemailer = require("nodemailer");
const { SMTP_USER_NAME, SMTP_USER_PASS } = require("../constants.js");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: SMTP_USER_NAME,
    pass: SMTP_USER_PASS,
  },
});

const sendEmailWithNodeMailer = async (emailData) => {
  try {
    const mailOptions = {
      from: SMTP_USER_NAME, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject, // Subject line
      html: emailData.html, // html body
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Could not sent email error", error.message);
    throw new error();
  }
};

module.exports = sendEmailWithNodeMailer;
