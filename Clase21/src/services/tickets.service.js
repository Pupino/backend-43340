//@ts-check
import { ticketsModel } from '../dao/mongo/tickets.mongo.js';

class TicketsService {
  async createTicket(tkt) {
    try {
      let tktCreated = await ticketsModel.createTicket(tkt);
      return tktCreated;
    } catch (e) {
      throw e;
    }
  }
}

export const ticketService = new TicketsService();
