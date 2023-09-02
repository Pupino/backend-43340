import express from 'express';
export const recoversRouter = express.Router();
import { recoverController } from '../controllers/recovers.controller.js';

//Recover eMail BEGIN
recoversRouter.get('/email', (_, res) => {
  res.render('recover-email');
});
recoversRouter.post('/email', recoverController.createCodeFromEmail);
recoversRouter.get('/recover-pass', recoverController.recoverPass);
recoversRouter.post('/recover-pass', recoverController.saveNewPass);
//Recover eMail END
