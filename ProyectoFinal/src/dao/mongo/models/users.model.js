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
  // cartId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'carts',
  //   required: false, //it's false because some other authenticate 3rd party could not have it
  //   default: null,
  // },
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
  //Modificar el modelo de User para que cuente con una nueva propiedad “documents” el cual será un array que contenga los objetos con las siguientes propiedades
  //name: String (Nombre del documento).
  //reference: String (link al documento).
  //Además, agregar una propiedad al usuario llamada lastConnection, la cual deberá modificarse cada vez que el usuario realice un proceso de login y logout
  //documents: [] {name: 'ticketpago.jpg', reference: 'idusuario/documents/tickets'} {name: 'dni.jpg', reference: 'idusuario/documents/tickets'}
  //lastConnection:
  lastConnection: {
    type: Date,
    required: false,
  },
});
schema.plugin(monsoosePaginate);
export const UserModel = model('users', schema);
