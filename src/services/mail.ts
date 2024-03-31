import nodemailer, { SendMailOptions } from "nodemailer";

export const sendEmail = async (options: SendMailOptions) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    secure: true,
  });
  const emailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  transporter.sendMail(emailOptions, (error, info) => {
    if (error) {
      return error;
    } else {
      console.log("Sent email successfully to: ", options.to);
      console.log(`Email sent: ${info.response}`);
    }
  });
  return null;
};
