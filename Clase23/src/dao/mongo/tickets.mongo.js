//@ts-check
import { TicketModel } from './models/tickets.model.js';

export default class Tickets {
  constructor() {}

  async createTicket(ticket) {
    try {
      const tktCreated = await TicketModel.create(ticket);
      return tktCreated;
    } catch (e) {
      console.error(e);
      return e;
    }
  }
}

export const ticketsModel = new Tickets();
