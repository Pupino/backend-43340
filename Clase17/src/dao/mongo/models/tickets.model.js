//@ts-check
import { Schema, model } from 'mongoose';

const schema = new Schema({
  //userId: { type: Schema.Types.ObjectId, ref: 'users' },
  code: {
    type: String,
    default: function () {
      return Math.random().toString(36).substr(2, 6); // Genera un código único de 6 caracteres
    },
    unique: true,
  },
  purchase_datetime: { type: Date, default: Date.now, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
});

export const TicketModel = model('tickets', schema);
