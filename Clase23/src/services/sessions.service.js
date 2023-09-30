class SessionsService {
  callbackRta() {
    let rta = {
      status: 200,
      redirect: '/api/products',
      msg: '',
    };
    return rta;
  }
}

export const sessionsService = new SessionsService();
