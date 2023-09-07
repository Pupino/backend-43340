import passport from 'passport';
import express from 'express';
import { sessionController } from '../controllers/sessions.controller.js';
export const sessionsRouter = express.Router();

sessionsRouter.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

sessionsRouter.get(
  '/githubcallback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  sessionController.getGitHubCallback
);

sessionsRouter.get('/current', sessionController.getCurrentSession);
