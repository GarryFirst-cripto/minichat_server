import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import env from '../../config/dbConfig';

const { smtpUser, smtpClient, smtpSecret, smtpToken } = env.smtp;

const { OAuth2 } = google.auth;
const oauth2Client = new OAuth2(smtpClient, smtpSecret, 'https://developers.google.com/oauthplayground');
oauth2Client.setCredentials({
  refresh_token: smtpToken
});
const accessToken = async () => {
  const result = await oauth2Client.getAccessToken();
  return result;
};

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: smtpUser,
    clientId: smtpClient,
    clientSecret: smtpSecret,
    refreshToken: smtpToken,
    accessToken: accessToken()
  }
});

export const sendMail = async mail => {
  const mailOptions = {
    from: smtpUser,
    to: mail.email,
    subject: mail.mailThema,
    html: mail.htmlText
  };
  env.reff = mail.origin;
  const { rejected, response } = await smtpTransport.sendMail(mailOptions);
  return { rejected, response };
};
