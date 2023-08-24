import { chatSocketService } from '../services/chat-socket.service.js';
import CustomError from '../services/errors/custom-error.js';
import EErros from '../services/errors/enum.js';

class ChatSocketController {
  getChatSocket(req, res) {
    try {
      //1-extrae del request los datos
      //2-NO trabaja. pasa el problema al service.
      const chatSocket = chatSocketService.getChatSocket();
      //3-Responde al usuario final
      return res.render(chatSocket);
    } catch (e) {
      CustomError.createError({
        name: 'Get chat socket error',
        cause: 'Contact Development team',
        message: e,
        code: EErros.CHAT_SOCKET_ERROR,
      });
    }
  }
}

export const chatSocketController = new ChatSocketController();
