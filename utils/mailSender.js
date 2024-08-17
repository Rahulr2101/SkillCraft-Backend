const nodemailer = require("nodemailer");

const sendEmail = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
    });

    let info =  await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: `${email}`,
        subject: `${title}`,
        html: `${body}`,
        
    });
    console.log(info);
    return info;
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendEmail;
