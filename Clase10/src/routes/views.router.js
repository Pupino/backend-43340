import express from 'express';
import { checkAdmin, checkUser } from '../middlewares/auth.js';
export const viewsRouter = express.Router();

viewsRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.render('error-page', { msg: 'no se pudo cerrar la session' });
    }
    return res.redirect('/login');
  });
});

viewsRouter.get('/login', (req, res) => {
  res.render('login-form');
});

viewsRouter.get('/register', (req, res) => {
  res.render('register-form');
});

viewsRouter.get('/profile', checkUser, (req, res) => {
  res.render('profile', { profile: req.session });
});

viewsRouter.get('/solo-para-admin', checkAdmin, (req, res) => {
  res.send('ESTO SOLO LO PUEDE VER EL ADMIN');
});
