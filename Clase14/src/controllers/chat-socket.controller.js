import { chatSocketService } from '../services/chat-socket.service.js';

class ChatSocketController {
  getChatSocket(req, res) {
    //1-extrae del request los datos
    //2-NO trabaja. pasa el problema al service.
    const chatSocket = chatSocketService.getChatSocket();
    //3-Responde al usuario final
    return res.render(chatSocket);
  }
}

export const chatSocketController = new ChatSocketController();
