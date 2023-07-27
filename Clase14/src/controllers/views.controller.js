//@ts-check
import { viewsService } from '../services/views.service.js';

class ViewsController {
  home(req, res) {
    //1-extrae del request los datos
    //2-NO trabaja. pasa el problema al service.
    const home = viewsService.getHome();
    //3-Responde al usuario final
    return res.render(home);
  }
  login(req, res) {
    //1-extrae del request los datos
    //2-NO trabaja. pasa el problema al service.
    const login = viewsService.login();
    //3-Responde al usuario final
    return res.render(login);
  }
  logout(req, res) {
    //1-extrae del request los datos
    req.session.destroy((err) => {
      let sessionError = err.toString();
      //2-NO trabaja. pasa el problema al service.
      const logoutRta = viewsService.logout(sessionError);
      //3-Responde al usuario final
      return res
        .status(logoutRta.status)
        .render(logoutRta.render, logoutRta.msg);
    });
  }
}

export const viewsController = new ViewsController();
