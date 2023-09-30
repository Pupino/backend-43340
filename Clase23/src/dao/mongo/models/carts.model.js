//@ts-check
import { Schema, model } from 'mongoose';

//Esta vez, para el modelo de Carts, en su propiedad products, el id de cada producto generado dentro del array tiene que hacer referencia al modelo de Products. Modificar la ruta /:cid para que al traer todos los productos, los traiga completos mediante un “populate”. De esta manera almacenamos sólo el Id, pero al solicitarlo podemos desglosar los productos asociados.

/*const subEschema = new Schema({
  //prodId: { type: String, required: false },
  prodId: {
    type: Schema.Types.ObjectId,
    ref: 'products',
  },
  quantity: { type: Number, required: false },
});

const schema = new Schema({
  productsArray: [subEschema],
});*/

const schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    //default: '64b7f423ca1f7487754f9586',
  },
  productsArray: [
    {
      prodId: { type: Schema.Types.ObjectId, ref: 'products', required: false },
      quantity: { type: Number, required: false },
    },
  ],
});

export const CartModel = model('carts', schema);
