import express from 'express';
import { twilioClient } from '../Utils/messaging.js';
import { logger } from '../Utils/logger.js';
import { entorno } from '../config.js';
export const smsRouter = express.Router();

smsRouter.get('/', async (req, res) => {
  //Twilio
  const result = await twilioClient.messages.create({
    body: 'Holissss desde node.js!',
    from: entorno.TWILIO_PHONE_NUMBER,
    to: entorno.TWILIO_TO_PHONE,
  });
  logger.debug(`sms entrypoint result: ${result}`);
  res.send('SMS sent');
});
