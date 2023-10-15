//@ts-check
import { authService } from '../services/auth.service.js';
import CustomError from '../services/errors/custom-error.js';
import EErros from '../services/errors/enum.js';
import { logger } from '../Utils/logger.js';

class AuthController {
  getSession(req, res) {
    try {
      //1-extrae del request los datos
      const session = req.session;
      //2-NO trabaja. pasa el problema al service.
      const authSession = authService.getSession(session);
      //3-Responde al usuario final
      return res.send(authSession);
    } catch (e) {
      logger.error(`AuthController.getSession: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Get Session Error',
        cause: 'Please contact development team',
        message: e,
        code: EErros.GET_SESSION_ERROR,
      });
    }
  }
  getRegister(_, res) {
    try {
      //1-extrae del request los datos
      //2-NO trabaja. pasa el problema al service.
      //3-Responde al usuario final
      const register = authService.getRegister();
      return res.render(register, {});
    } catch (e) {
      logger.error(`AuthController.getRegister: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Get Register Error',
        cause: 'Please contact development team',
        message: e,
        code: EErros.GET_REGISTER_ERROR,
      });
    }
  }
  postRegister(req, res) {
    try {
      //1-extrae del request los datos
      const user = req;
      //2-NO trabaja. pasa el problema al service.
      const registerRta = authService.postRegister(req.user);
      //3-Responde al usuario final
      if (registerRta.status === 500) {
        return res
          .status(registerRta.status)
          .render(registerRta.render, registerRta.msg);
      } else {
        req.session.user = registerRta.session_user;
        return res.redirect('/api/products');
      }
    } catch (e) {
      logger.error(`AuthController.postRegister: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Post Register Error',
        cause: 'Please contact development team',
        message: e,
        code: EErros.POST_REGISTER_ERROR,
      });
    }
  }

  failRegister(req, res) {
    try {
      //1-extrae del request los datos
      //2-NO trabaja. pasa el problema al service.
      const failRegisterRta = authService.failRegister();
      //3-Responde al usuario final
      return res
        .status(failRegisterRta.status)
        .render(failRegisterRta.render, failRegisterRta.msg);
    } catch (e) {
      logger.error(`AuthController.failRegister: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Fail Register Error',
        cause: 'Please contact development team',
        message: e,
        code: EErros.FAIL_REGISTER_ERROR,
      });
    }
  }

  loginForm(req, res) {
    try {
      //1-extrae del request los datos
      //2-NO trabaja. pasa el problema al service.
      const loginFormRta = authService.loginForm();
      //3-Responde al usuario final
      return res
        .status(loginFormRta.status)
        .render(loginFormRta.render, loginFormRta.msg);
    } catch (e) {
      logger.error(`AuthController.loginForm: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Fail login form',
        cause: 'Please contact development team',
        message: e,
        code: EErros.LOGIN_FORM_ERROR,
      });
    }
  }

  login(req, res) {
    try {
      //1-extrae del request los datos
      const user = req;
      //2-NO trabaja. pasa el problema al service.
      const loginRta = authService.login(req.user);
      //3-Responde al usuario final
      if (loginRta.status === 500) {
        return res
          .status(loginRta.status)
          .render(loginRta.render, loginRta.msg);
      } else {
        req.session.user = loginRta.session_user;
        return res.redirect(loginRta.redirect);
      }
    } catch (e) {
      logger.error(`AuthController.login: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Login error',
        cause: 'Please contact development team',
        message: e,
        code: EErros.LOGIN_ERROR,
      });
    }
  }

  failLogin(req, res) {
    try {
      //1-extrae del request los datos
      //2-NO trabaja. pasa el problema al service.
      const failLoginRta = authService.faillogin();
      //3-Responde al usuario final
      return res
        .status(failLoginRta.status)
        .render(failLoginRta.render, failLoginRta.msg);
    } catch (e) {
      logger.error(`AuthController.failLogin: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Fail login Error',
        cause: 'Please contact development team',
        message: e,
        code: EErros.FAIL_LOGIN_ERROR,
      });
    }
  }

  logout(req, res) {
    try {
      //1-extrae del request los datos
      req.session.destroy((err) => {
        let sessionError = err.toString();
        //2-NO trabaja. pasa el problema al service.
        const logoutRta = authService.logout(sessionError);
        //3-Responde al usuario final
        if (logoutRta.status === 500) {
          return res
            .status(logoutRta.status)
            .render(logoutRta.render, logoutRta.msg);
        } else {
          return res.redirect(logoutRta.redirect);
        }
      });
    } catch (e) {
      logger.error(`AuthController.logout: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Logout Error',
        cause: 'Please contact development team',
        message: e,
        code: EErros.FAIL_LOGOUT_ERROR,
      });
    }
  }

  getPerfil(req, res) {
    try {
      //1-extrae del request los datos
      const user = req.session.user;
      //2-NO trabaja. pasa el problema al service.
      const getPerfilRta = authService.getPerfil(user);
      //3-Responde al usuario final
      return res.render(getPerfilRta.render, { user: getPerfilRta.user });
    } catch (e) {
      logger.error(`AuthController.getPerfil: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Get perfil error',
        cause: 'Please contact development team',
        message: e,
        code: EErros.GET_PERFIL_ERROR,
      });
    }
  }

  getAdministracion(_, res) {
    try {
      //1-extrae del request los datos
      //2-NO trabaja. pasa el problema al service.
      const getAdminRta = authService.getAdministracion();
      return res.send(getAdminRta.msg);
    } catch (e) {
      logger.error(
        `AuthController.getAdministracion: ${JSON.stringify(e.cause)}`
      );
      CustomError.createError({
        name: 'Get administration error',
        cause: 'Please contact development team',
        message: e,
        code: EErros.GET_ADMIN_ERROR,
      });
    }
  }
}

export const authController = new AuthController();
