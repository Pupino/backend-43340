//@ts-check
import { Schema, model } from 'mongoose';

const schema = new Schema({
  email: { type: String, required: true, max: 100 },
  code: { type: String, required: true },
  expire: { type: Number, required: true },
});

export const RecoverCodesModel = model('recover-codes', schema);
