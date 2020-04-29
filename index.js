"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE || false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || testAccount.user, // generated ethereal user
      pass: process.env.SMTP_PASSWORD || testAccount.pass // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.EMAIL_FROM, // sender address
    to: process.env.EMAIL_TO_LIST, // list of receivers
    subject: process.env.EMAIL_SUB, // Subject line
    text: process.env.EMAIL_TEXT, // plain text body
    html: process.env.EMAIL_HTML // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
