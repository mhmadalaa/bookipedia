const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  let transporter;
  // 1. Create transporter
  if (process.env.NODE_ENV === 'production') {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST_PROD,
      port: process.env.EMAIL_PORT_PROD,
      auth: {
        user: process.env.EMAIL_USERNAME_PROD,
        pass: process.env.EMAIL_PASSWORD_PROD,
      },
    });
  }
  else {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST_DEV,
      port: process.env.EMAIL_PORT_DEV,
      auth: {
        user: process.env.EMAIL_USERNAME_DEV,
        pass: process.env.EMAIL_PASSWORD_DEV,
      },
    });
  }
  

  // 2. Define the email options
  const mailOptions = {
    from: 'Bookipedia <bookipedia-backend@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
