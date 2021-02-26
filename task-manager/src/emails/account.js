const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'dougschallmoser@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app ${name}!`
  })
}

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'dougschallmoser@gmail.com',
    subject: 'Sorry to see you go',
    text: `Goodbye, ${name}. We hope you come back in the future.`
  })
}

module.exports =  {
  sendWelcomeEmail,
  sendCancellationEmail
}