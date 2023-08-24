import { entorno } from '../config.js';
//import { connectMongo } from '../Utils/connections.js';

let cartsPersist;
let productsPersist;

switch (entorno.PERSISTENCE) {
  case 'MONGO':
    //connectMongo(); //to implement that here, I need to create users.memory.js and update passport.config.js
    //Carts
    const { default: CartModelMongo } = await import('./mongo/carts.mongo.js');
    cartsPersist = CartModelMongo;
    //Products
    const { default: ProductModelMongo } = await import(
      './mongo/products.mongo.js'
    );
    productsPersist = ProductModelMongo;
    break;

  case 'MEMORY':
    //Carts
    const { default: CartModelMemory } = await import(
      './memory/carts.memory.js'
    );
    cartsPersist = CartModelMemory;
    //Products
    const { default: ProductModelMemory } = await import(
      './memory/products.memory.js'
    );
    productsPersist = ProductModelMemory;
    break;

  default:
    break;
}

export const cartsModel = new cartsPersist();
export const productsModel = new productsPersist();
