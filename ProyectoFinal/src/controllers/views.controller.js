//@ts-check
import { viewsService } from '../services/views.service.js';
import CustomError from '../services/errors/custom-error.js';
import EErros from '../services/errors/enum.js';
import { logger } from '../Utils/logger.js';

class ViewsController {
  home(req, res) {
    try {
      //1-extrae del request los datos
      //2-NO trabaja. pasa el problema al service.
      const home = viewsService.getHome();
      //3-Responde al usuario final
      return res.render(home);
    } catch (e) {
      logger.error(`ViewsController.home: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Home error',
        cause: 'Please contact development team',
        message: e,
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
      logger.error(`ViewsController.login: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Login error',
        cause: 'Please contact development team',
        message: e,
        code: EErros.GET_LOGIN_ERROR,
      });
    }
  }
  logout(req, res) {
    try {
      //1-extrae del request los datos
      const userId = req.session.user._id;
      req.session.destroy((err) => {
        let sessionError = err.toString();
        //2-NO trabaja. pasa el problema al service.
        const logoutRta = viewsService.logout(sessionError, userId);
        //3-Responde al usuario final
        return res
          .status(logoutRta.status)
          .render(logoutRta.render, logoutRta.msg);
      });
    } catch (e) {
      logger.error(`ViewsController.logout: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Logout error',
        cause: 'Please contact development team',
        message: e,
        code: EErros.GET_LOGOUT_ERROR,
      });
    }
  }
}

export const viewsController = new ViewsController();
