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
  cart: {
    type: String,
    required: false, //it's false because some other authenticate 3rd party could not have it
  },
  role: {
    type: String,
    default: 'user',
    required: true,
    max: 100,
  },
});
schema.plugin(monsoosePaginate);
export const UserModel = model('users', schema);
