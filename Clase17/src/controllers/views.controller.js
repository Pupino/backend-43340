//@ts-check
import { viewsService } from '../services/views.service.js';
import CustomError from '../services/errors/custom-error.js';
import EErros from '../services/errors/enum.js';

class ViewsController {
  home(req, res) {
    try {
      //1-extrae del request los datos
      //2-NO trabaja. pasa el problema al service.
      const home = viewsService.getHome();
      //3-Responde al usuario final
      return res.render(home);
    } catch (e) {
      CustomError.createError({
        name: 'Home error',
        cause: 'Please contact development team',
        message: 'Error trying to call get Home',
        code: EErros.GET_HOME_ERROR,
      });
    }
  }
  login(req, res) {
    try {
      //1-extrae del request los datos
      //2-NO trabaja. pasa el problema al service.
      const login = viewsService.login();
      //3-Responde al usuario final
      return res.render(login);
    } catch (e) {
      CustomError.createError({
        name: 'Login error',
        cause: 'Please contact development team',
        message: 'Error trying to get Login',
        code: EErros.GET_LOGIN_ERROR,
      });
    }
  }
  logout(req, res) {
    try {
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
    } catch (e) {
      CustomError.createError({
        name: 'Logout error',
        cause: 'Please contact development team',
        message: 'Error trying to get Logout',
        code: EErros.GET_LOGOUT_ERROR,
      });
    }
  }
}

export const viewsController = new ViewsController();
