const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

dotenv.config({ path: './config.env' });

class Email {
  constructor(to) {
    this.to = to;
  }

  newTransport() {
    //si estoy en producción, cambio esto y actualizo la dirección email de abajo o sendgrid no envía el correo
    if (process.env.NODE_ENV === 'development') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      });
    }

    return nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '4be20a88ca7a16',
        pass: '6b2997b3c75aa7',
      },
    });
  }

  // Send the actual email
  async send(template, subject, emailData) {
    // Get the pug file that needs to be send
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      emailData
    );

    await this.newTransport().sendMail({
      from: 'superrepairs@super.com',
      to: this.to,
      subject: 'Super Repairs',
      html,
      text: htmlToText(html),
    });
  }

  // Send an email to newly created account
  async sendWelcome(name) {
    await this.send('welcome', 'New account', { name });
  }

  // Send an email when a post is published
  async sendNotice(name) {
    await this.send('notice', 'Repair finished', { name });
  }
}

module.exports = { Email };
