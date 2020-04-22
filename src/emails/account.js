const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "doko.0224@gmail.com",
    subject: "Биднийг дэмжиж байгаад баярлалаа",
    text: `Системд тавтай морилно уу ${name}.
    
    
    Хүндэтгэсэн
    Дөлгөөн
    `
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "doko.0224@gmail.com",
    subject: "Баяртай",
    text: `Баяртай, ${name}.`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
};
