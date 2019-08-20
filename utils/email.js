
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    type: 'login',
    user: process.env.emailUsername,
    pass: process.env.emailPassword,
  },
});

const createMailOptions = content => ({
  from: `Recruiter Bot <${process.env.email}>`,
  to: process.env.emailRecipient,
  subject: 'Email from recruiter bot',
  html: content,
});

const createTableStringFromObject = (contentObject) => {
  const keyArray = Object.keys(contentObject);
  const tableRows = keyArray.map((key) => `<tr style="text-align: left;"><th style="width: 100px; padding: 10px 0;">${key}:</th><td style="padding: 10px 0;">${contentObject[key]}</td></tr>`);
  return (
    `<table style="width: 100%;"><tbody>${tableRows.join('')}</tbody></table>`
  );
}


const sendMail = (mailOptions) => {
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('ERROR:', err);
    } 
    transporter.close();
  });
};

module.exports = {
  sendMail,
  createMailOptions,
  createTableStringFromObject,
};
