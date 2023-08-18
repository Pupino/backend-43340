import { sessionsService } from '../services/sessions.service.js';
import userRtaDTO from '../dao/DTO/userRta.dto.js';
import CustomError from '../services/errors/custom-error.js';
import EErros from '../services/errors/enum.js';

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
      CustomError.createError({
        name: 'GitHub Authentication',
        cause: 'Please contact development team',
        message: 'Error trying to call getGitHubCallback',
        code: EErros.GITHUB_SESSION_ERROR,
      });
    }
  }

  getCurrentSession(req, res) {
    try {
      //console.log('session completa sin DTO: ' + JSON.stringify(req.session));
      const userRta = new userRtaDTO(req.session);
      return res.send(JSON.stringify(userRta));
    } catch (e) {
      CustomError.createError({
        name: 'Current Session Error',
        cause: 'Please contact development team',
        message: 'Error trying to call getCurrentSession',
        code: EErros.CURRENT_SESSION_ERROR,
      });
    }
  }
}

export const sessionController = new SessionsController();
