import { entorno } from '../config.js';

import nodemailer from 'nodemailer';
export const sendEmailTransport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: { user: entorno.GOOGLE_EMAIL, pass: entorno.GOOGLE_PASS },
});

import twilio from 'twilio';
export const twilioClient = twilio(
  entorno.TWILIO_ACCOUNT_SID,
  entorno.TWILIO_AUTH_TOKEN
);
