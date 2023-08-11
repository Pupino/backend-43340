import { sessionsService } from '../services/sessions.service.js';
import userRtaDTO from '../dao/DTO/userRta.dto.js';

class SessionsController {
  getGitHubCallback(req, res) {
    //1-extrae del request los datos
    req.session.user = req.user;
    console.log('callback github');
    //2-NO trabaja. pasa el problema al service.
    const callbackRta = sessionsService.callbackRta();
    //3-Responde al usuario final
    // Successful authentication, redirect home.
    res.redirect(callbackRta.redirect);
  }

  getCurrentSession(req, res) {
    console.log('session completa sin DTO: ' + JSON.stringify(req.session));
    const userRta = new userRtaDTO(req.session);
    return res.send(JSON.stringify(userRta));
  }
}

export const sessionController = new SessionsController();
