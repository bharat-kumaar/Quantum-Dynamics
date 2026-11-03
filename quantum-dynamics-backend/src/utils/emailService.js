const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    // Transporter configure kar rahe hain (Gmail ke liye)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Tera Email ID aayega `.env` se
        pass: process.env.EMAIL_PASS, // Tera App Password aayega `.env` se
      },
    });

    const mailOptions = {
      from: `"Quantum Dynamics" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.email}`);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Could not send email");
  }
};

module.exports = sendEmail;