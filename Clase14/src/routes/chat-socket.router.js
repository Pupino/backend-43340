import express from 'express';
import { chatSocketController } from '../controllers/chat-socket.controller.js';

export const routerVistaChatSocket = express.Router();

routerVistaChatSocket.get('/', chatSocketController.getChatSocket);
