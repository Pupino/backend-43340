//@ts-check
import { authService } from '../services/auth.service.js';

class AuthController {
  getSession(req, res) {
    //1-extrae del request los datos
    const session = req.session;
    //2-NO trabaja. pasa el problema al service.
    const authSession = authService.getSession(session);
    //3-Responde al usuario final
    return res.send(authSession);
  }
  getRegister(_, res) {
    //1-extrae del request los datos
    //2-NO trabaja. pasa el problema al service.
    //3-Responde al usuario final
    const register = authService.getRegister();
    return res.render(register, {});
  }
  postRegister(req, res) {
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
  }

  failRegister(req, res) {
    //1-extrae del request los datos
    //2-NO trabaja. pasa el problema al service.
    const failRegisterRta = authService.failRegister();
    //3-Responde al usuario final
    return res
      .status(failRegisterRta.status)
      .render(failRegisterRta.render, failRegisterRta.msg);
  }

  loginForm(req, res) {
    //1-extrae del request los datos
    //2-NO trabaja. pasa el problema al service.
    const loginFormRta = authService.loginForm();
    //3-Responde al usuario final
    return res
      .status(loginFormRta.status)
      .render(loginFormRta.render, loginFormRta.msg);
  }

  login(req, res) {
    //1-extrae del request los datos
    const user = req;
    //2-NO trabaja. pasa el problema al service.
    const loginRta = authService.login(req.user);
    //3-Responde al usuario final
    if (loginRta.status === 500) {
      return res.status(loginRta.status).render(loginRta.render, loginRta.msg);
    } else {
      req.session.user = loginRta.session_user;
      return res.redirect(loginRta.redirect);
    }
  }

  failLogin(req, res) {
    //1-extrae del request los datos
    //2-NO trabaja. pasa el problema al service.
    const failLoginRta = authService.faillogin();
    //3-Responde al usuario final
    return res
      .status(failLoginRta.status)
      .render(failLoginRta.render, failLoginRta.msg);
  }

  logout(req, res) {
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
  }

  getPerfil(req, res) {
    //1-extrae del request los datos
    const user = req.session.user;
    //2-NO trabaja. pasa el problema al service.
    const getPerfilRta = authService.getPerfil(user);
    //3-Responde al usuario final
    return res.render(getPerfilRta.render, { user: getPerfilRta.user });
  }

  getAdministracion(_, res) {
    //1-extrae del request los datos
    //2-NO trabaja. pasa el problema al service.
    const getAdminRta = authService.getAdministracion();
    return res.send(getAdminRta.msg);
  }
}

export const authController = new AuthController();
