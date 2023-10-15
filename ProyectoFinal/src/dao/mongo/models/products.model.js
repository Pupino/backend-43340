//@ts-check
import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  status: { type: Boolean, required: true, default: true },
  owner: { type: String, required: true, default: 'admin' },
});
schema.plugin(mongoosePaginate);
export const ProductModel = model('products', schema);
