import { logger } from '../Utils/logger.js';

export function isUser(req, res, next) {
  logger.debug(`isUser req.session: ${JSON.stringify(req.session)}`);
  if (req.session.user) {
    return next();
  }
  return res.status(401).render('error-page', { msg: 'please log in' });
}

export function isAdmin(req, res, next) {
  if (req.session.user.email && req.session.user.isAdmin) {
    return next();
  }
  logger.debug(`User is NOT Admin, validation don't pass`);
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

export function isPremium(req, res, next) {
  if (req.session.user.email && req.session.user.isPremium) {
    return next();
  }
  logger.debug(`User is NOT Premium, validation don't pass`);
  return res
    .status(401)
    .render('error-page', { msg: 'please log in AS PREMIUM!' });
}

export function isPremiumOrAdmin(req, res, next) {
  logger.debug(`req.session.user.isPremium: ${req.session.user.isPremium}`);
  if (
    req.session.user.email &&
    (req.session.user.isPremium || req.session.user.isAdmin)
  ) {
    return next();
  }
  logger.debug(`User is NOT Premium and also NOT Admin, validation don't pass`);
  return res
    .status(401)
    .render('error-page', { msg: 'please log in AS PREMIUM or ADMIN' });
}
