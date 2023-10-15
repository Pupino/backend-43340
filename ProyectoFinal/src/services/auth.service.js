//@ts-check
import { usersModel } from '../dao/factory.js';

class AuthService {
  getSession(session) {
    return JSON.stringify(session);
  }
  getRegister() {
    return 'register-form';
  }
  postRegister(user) {
    if (!user) {
      let rta = {
        status: 500,
        render: 'error-page',
        msg: 'something went wrong',
      };
      return rta;
    }
    let session_user = {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
    };
    const userUpdated = usersModel.setLastConnection(user._id);
    let rta = {
      status: 200,
      session_user,
    };
    return rta;
  }

  failRegister() {
    let rta = {
      status: 500,
      render: 'error-page',
      msg: 'fail to register',
    };
    return rta;
  }

  loginForm() {
    let rta = {
      status: 200,
      render: 'login-form',
      msg: {},
    };
    return rta;
  }

  login(user) {
    if (!user) {
      let rta = {
        status: 500,
        render: 'error-page',
        msg: 'invalid credentials',
      };
      return rta;
    }
    let session_user = {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
      isPremium: user.isPremium,
      cartId: user.cartId,
    };
    //settear lastConnection = sysdate
    const userUpdated = usersModel.setLastConnection(user._id);
    let rta = {
      status: 200,
      session_user,
      redirect: '/api/products',
    };
    return rta;
  }

  faillogin() {
    let rta = {
      status: 500,
      render: 'error-page',
      msg: 'fail to login',
    };
    return rta;
  }

  logout(sessionError) {
    if (sessionError === 'true') {
      let rta = {
        status: 500,
        render: 'error-page',
        msg: 'no se pudo cerrar su session',
      };
      return rta;
    }
    let rta = { status: 200, redirect: '/api/auth/login', msg: '' };
    return rta;
  }

  getPerfil(user) {
    let rta = {
      status: 200,
      render: 'perfil',
      user,
    };
    return rta;
  }

  getAdministracion() {
    let rta = {
      msg: 'datos super secretos clasificados sobre los nuevos ingresos a boca juniors',
    };
    return rta;
  }
}

export const authService = new AuthService();
