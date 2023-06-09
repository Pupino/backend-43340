//@ts-check
import { Schema, model } from 'mongoose';

const subEschema = new Schema({
  prodId: { type: String, required: false },
  quantity: { type: Number, required: false },
});

const schema = new Schema({
  miArray: [subEschema],
});

export const CartModel = model('carts', schema);
