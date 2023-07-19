import express from 'express';
import passport from 'passport';
import { isAdmin, isUser } from '../middlewares/auth.js';

export const authRouter = express.Router();

authRouter.get('/session', (req, res) => {
  return res.send(JSON.stringify(req.session));
});

authRouter.get('/register', (req, res) => {
  return res.render('register-form', {});
});

authRouter.post(
  '/register',
  passport.authenticate('register', { failureRedirect: '/auth/failregister' }),
  (req, res) => {
    if (!req.user) {
      return res.json({ error: 'something went wrong' });
    }
    req.session.user = {
      _id: req.user._id.toString(),
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
    };

    //return res.json({ msg: 'ok', payload: req.user });
    return res.redirect('/api/products');
  }
);

authRouter.get('/failregister', async (req, res) => {
  return res.json({ error: 'fail to register' });
});

authRouter.get('/login', (req, res) => {
  return res.render('login-form', {});
});

authRouter.post(
  '/login',
  passport.authenticate('login', { failureRedirect: '/auth/faillogin' }),
  async (req, res) => {
    if (!req.user) {
      return res.json({ error: 'invalid credentials' });
    }
    console.log(req.user);
    req.session.user = {
      _id: req.user._id.toString(),
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
    };

    //return res.json({ msg: 'ok', payload: req.user });
    return res.redirect('/api/products');
  }
);

authRouter.get('/faillogin', async (req, res) => {
  return res.json({ error: 'fail to login' });
});

authRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render('error-page', { error: 'no se pudo cerrar su session' });
    }
    //return res.redirect('/auth/login');
    return res.redirect('/api/auth/login');
  });
});

authRouter.get('/perfil', isUser, (req, res) => {
  const user = req.session.user;
  return res.render('perfil', { user: user });
});

authRouter.get('/administracion', isUser, isAdmin, (req, res) => {
  return res.send(
    'datos super secretos clasificados sobre los nuevos ingresos a boca juniors'
  );
});
