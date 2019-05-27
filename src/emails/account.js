const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "Mostapha.a.aly@gmail.com",
    subject: "Thanks for joining in",
    text: `Welcome to my Task manager app, ${name}.`
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "Mostapha.a.aly@gmail.com",
    subject: "Sorry to see you go",
    text: `Goodbye, ${name}.`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
};
