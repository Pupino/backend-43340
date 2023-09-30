import { recoverService } from '../services/recovers.service.js';
import CustomError from '../services/errors/custom-error.js';
import EErros from '../services/errors/enum.js';
import { logger } from '../Utils/logger.js';

class RecoverController {
  async createCodeFromEmail(req, res) {
    try {
      //1-extrae del request los datos
      const { email } = req.body;
      //2-NO trabaja. pasa el problema al service.
      const rta = await recoverService.createCodeFromEmail(email);
      //3-Responde al usuario final
      res.render('check-email');
    } catch (e) {
      CustomError.createError({
        name: 'Create Code from Email to reset password error',
        cause: 'Contact Development team',
        message: e,
        code: EErros.CREATE_CODE_FROM_EMAIL_ERROR,
      });
    }
  }

  async recoverPass(req, res) {
    try {
      logger.debug(`req.query: ${JSON.stringify(req.query)}`);
      //1-extrae del request los datos
      const { code, email } = req.query;
      logger.debug(`code: ${code} - email ${email}`);
      //2-NO trabaja. pasa el problema al service.
      const rta = await recoverService.recoverPass(email, code);
      logger.debug(`rta en controller: ${JSON.stringify(rta)}`);
      res.render(rta.view, { msg: rta.msg, email: rta.email, code: rta.code });
    } catch (e) {
      CustomError.createError({
        name: 'Recover password error',
        cause: 'Contact Development team',
        message: e,
        code: EErros.RECOVER_PASS_ERROR,
      });
    }
  }

  async saveNewPass(req, res) {
    try {
      //1-extrae del request los datos
      const { code, email, password } = req.body;
      logger.debug(`code: ${code} - email: ${email} - password: ${password}`);
      //2-NO trabaja. pasa el problema al service.
      const rta = await recoverService.saveNewPass(email, code, password);
      logger.debug(`rta en controller: ${JSON.stringify(rta)}`);
      res.render(rta.view, { msg: rta.msg, email: rta.email, code: rta.code });
    } catch (e) {
      CustomError.createError({
        name: 'Saving New password error',
        cause: 'Contact Development team',
        message: e,
        code: EErros.SAVING_NEW_PASS_ERROR,
      });
    }
  }
}

export const recoverController = new RecoverController();
