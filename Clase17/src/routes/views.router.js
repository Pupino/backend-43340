//@ts-check
import express from 'express';
export const viewsRouter = express.Router();
import { viewsController } from '../controllers/views.controller.js';

viewsRouter.get('/', viewsController.home);
viewsRouter.get('/login', viewsController.login);
viewsRouter.get('/logout', viewsController.logout);
