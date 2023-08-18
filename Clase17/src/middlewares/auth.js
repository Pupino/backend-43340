export function isUser(req, res, next) {
  //console.log('req.session: ' + JSON.stringify(req.session));
  if (req.session.user) {
    return next();
  }
  return res.status(401).render('error-page', { msg: 'please log in' });
}

export function isAdmin(req, res, next) {
  //console.log('req isAdmin: ', req);
  if (req.session.user.email && req.session.user.isAdmin) {
    return next();
  }
  return res
    .status(401)
    .render('error-page', { msg: 'please log in AS ADMIN!' });
}

export function isUserNotAdmin(req, res, next) {
  if (req.session.user && !req.session.isAdmin) {
    return next();
  }
  return res.status(401).render('error-page', { msg: 'user is admin' });
}
