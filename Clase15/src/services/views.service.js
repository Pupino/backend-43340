//@ts-check
class ViewsService {
  getHome() {
    return 'home';
  }
  login() {
    return 'login-github';
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
    let rta = { status: 200, render: 'login-github', msg: '' };
    return rta;
  }
}

export const viewsService = new ViewsService();
