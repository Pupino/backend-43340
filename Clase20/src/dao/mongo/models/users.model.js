//@ts-check
import { Schema, model } from 'mongoose';
import monsoosePaginate from 'mongoose-paginate-v2';

const schema = new Schema({
  email: {
    type: String,
    required: true,
    max: 100,
    unique: true,
  },
  password: {
    type: String,
    required: false, //it's false because some other authenticate 3rd party could not have it
    max: 100,
  },
  firstName: {
    type: String,
    required: false, //it's false because some other authenticate 3rd party could not have it
    max: 100,
  },
  lastName: {
    type: String,
    required: false, //it's false because some other authenticate 3rd party could not have it
    max: 100,
  },
  age: {
    type: Number,
    required: false, //it's false because some other authenticate 3rd party could not have it
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: 'carts',
    required: false, //it's false because some other authenticate 3rd party could not have it
    default: null,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true,
    max: 100,
  },
  isPremium: {
    type: Boolean,
    default: false,
    required: true,
    max: 100,
  },
});
schema.plugin(monsoosePaginate);
export const UserModel = model('users', schema);
