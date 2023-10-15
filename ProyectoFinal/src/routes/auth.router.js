import express from 'express';
import passport from 'passport';
import { authController } from '../controllers/auth.controller.js';
import { isAdmin, isUser } from '../middlewares/auth.js';

export const authRouter = express.Router();

authRouter.get('/session', authController.getSession);
authRouter.get('/register', authController.getRegister);

authRouter.post(
  '/register',
  passport.authenticate('register', { failureRedirect: '/auth/failregister' }),
  authController.postRegister
);

authRouter.get('/failregister', authController.failRegister);
authRouter.get('/login', authController.loginForm);

authRouter.post(
  '/login',
  passport.authenticate('login', { failureRedirect: '/auth/faillogin' }),
  authController.login
);

authRouter.get('/faillogin', authController.failLogin);
authRouter.get('/logout', authController.logout);
authRouter.get('/perfil', isUser, authController.getPerfil);

authRouter.get(
  '/administracion',
  isUser,
  isAdmin,
  authController.getAdministracion
);
