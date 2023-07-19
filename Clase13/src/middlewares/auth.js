export function isUser(req, res, next) {
  //console.log('req.session: ' + JSON.stringify(req.session));
  if (req.session.user) {
    return next();
  }
  return res.status(401).render('error-page', { msg: 'please log in' });
}

export function isAdmin(req, res, next) {
  if (req.session.user.email && req.session.isAdmin == true) {
    return next();
  }
  return res
    .status(401)
    .render('error-page', { msg: 'please log in AS ADMIN!' });
}
