// const { createTransport } = require("nodemailer");
// require("dotenv").config();

// const transporter = createTransport({
//   host: process.env.SMPT_HOST,
//   port: process.env.SMPT_PORT,
//   // service: process.env.SMPT_SERVICE,
//   auth: {
//     user: process.env.SMPT_MAIL,
//     pass: process.env.SMPT_PASSWORD,
//   },
// });

// const sendEmail = async (options) => {
//   await transporter.sendMail(options, function (error, info) {
//     if (error) {
//       console.log(error);
//     }
//   });
// };
// module.exports = { sendEmail };
const { createTransport } = require("nodemailer");
require("dotenv").config();

// Set up the SMTP transporter with Brevo's SMTP settings
const transporter = createTransport({
  host: process.env.SMPT_HOST,
  port: process.env.SMPT_PORT,
  auth: {
    user: process.env.SMPT_MAIL,
    pass: process.env.SMPT_PASSWORD,
  },
});

// Function to send email
const sendEmail = async (options) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SEND_EMAIL_FROM, // Sender email address
      to: options.to,                    // Recipient email address
      subject: options.subject,          // Email subject
      html: options.html,                // HTML content for the email body
    });
    // console.log("Email sent successfully:", info);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendEmail };
