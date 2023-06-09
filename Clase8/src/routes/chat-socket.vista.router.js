import express from 'express';

export const routerVistaChatSocket = express.Router();

routerVistaChatSocket.get('/', (req, res) => {
  return res.render('chat-socket', {});
});
