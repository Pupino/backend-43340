import { sessionsService } from '../services/sessions.service.js';
import userRtaDTO from '../dao/DTO/userRta.dto.js';
import CustomError from '../services/errors/custom-error.js';
import EErros from '../services/errors/enum.js';
import { logger } from '../Utils/logger.js';

class SessionsController {
  getGitHubCallback(req, res) {
    try {
      //1-extrae del request los datos
      req.session.user = req.user;
      //2-NO trabaja. pasa el problema al service.
      const callbackRta = sessionsService.callbackRta();
      //3-Responde al usuario final
      // Successful authentication, redirect home.
      res.redirect(callbackRta.redirect);
    } catch (e) {
      logger.error(
        `SessionsController.getGitHubCallback: ${JSON.stringify(e.cause)}`
      );
      CustomError.createError({
        name: 'GitHub Authentication',
        cause: 'Please contact development team',
        message: e,
        code: EErros.GITHUB_SESSION_ERROR,
      });
    }
  }

  getCurrentSession(req, res) {
    try {
      logger.debug(
        `getCurrentSession line 29 session completa sin DTO:: ${JSON.stringify(
          req.session
        )}`
      );
      const userRta = new userRtaDTO(req.session);
      return res.send(JSON.stringify(userRta));
    } catch (e) {
      logger.error(
        `SessionsController.getCurrentSession: ${JSON.stringify(e.cause)}`
      );
      CustomError.createError({
        name: 'Current Session Error',
        cause: 'Please contact development team',
        message: e,
        code: EErros.CURRENT_SESSION_ERROR,
      });
    }
  }
}

export const sessionController = new SessionsController();
