import passport from 'passport';
import express from 'express';
export const sessionsRouter = express.Router();

sessionsRouter.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

sessionsRouter.get(
  '/githubcallback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user = req.user;
    console.log('callback github');
    // Successful authentication, redirect home.
    res.redirect('/api/products');
  }
);

sessionsRouter.get('/current', (req, res) => {
  return res.send(JSON.stringify(req.session));
});
