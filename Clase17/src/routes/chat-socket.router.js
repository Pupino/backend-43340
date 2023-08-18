import express from 'express';
import { chatSocketController } from '../controllers/chat-socket.controller.js';
import { isUserNotAdmin } from '../middlewares/auth.js';

export const routerVistaChatSocket = express.Router();

routerVistaChatSocket.get(
  '/',
  isUserNotAdmin,
  chatSocketController.getChatSocket
);
