//@ts-check
import { usersModel } from '../dao/factory.js';

class ViewsService {
  getHome() {
    return 'login-form';
  }
  login() {
    return 'login-github';
  }
  logout(sessionError, id) {
    if (sessionError === 'true') {
      let rta = {
        status: 500,
        render: 'error-page',
        msg: 'no se pudo cerrar su session',
      };
      return rta;
    }
    const userUpdated = usersModel.setLastConnection(id);
    let rta = { status: 200, render: 'login-form', msg: '' };
    return rta;
  }
}

export const viewsService = new ViewsService();
