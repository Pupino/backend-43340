//@ts-check
//se usa @ts-check para q salten errores, es de typescript pero sirve para js
//import apis
//const fs = require('fs');
import fs from 'fs';

export class CartManager {
  constructor() {
    this.path = './src/carts.json'; //objects array, file to persist carts
    this.carts = [];
    //
    const cartsString = fs.readFileSync(this.path, 'utf-8');
    const carts = JSON.parse(cartsString); //once file string is retrieved, parse it to obtain the original format (object, array, etc)
    //
    this.carts = carts;
  }

  #generateId() {
    let maxId = 0;
    for (let index = 0; index < this.carts.length; index++) {
      const cart = this.carts[index];
      if (cart.id > maxId) {
        maxId = cart.id;
      }
    }
    return ++maxId;
  }

  async addCart(cart) {
    //all fields are mandatory
    try {
      let newCart = {
        id: this.#generateId(), //cart id
        products: [],
      };
      //this.products = [...this.carts, newCart];
      this.carts.push(newCart);
      //persist data into file
      const cartsString = JSON.stringify(this.carts); //convert array to string in order to persist data into file
      await fs.promises.writeFile(this.path, cartsString);
      //
      const rta = {
        code: 200,
        status: 'success',
        details: `Cart Created! New Cart data: ${JSON.stringify(newCart)}`,
      };
      return rta;
    } catch (error) {
      const rtaError = {
        code: 404,
        status: 'error',
        details: error,
      };
      return rtaError;
    }
    //
  }

  async getProductsByCartId(id) {
    //returns products array belong to cart id
    try {
      const cartsString = await fs.promises.readFile(this.path, 'utf-8');
      let carts = JSON.parse(cartsString); //once file string is retrieved, parse it to obtain the original format
      const cartFound = this.carts.find((cart) => cart.id == id);
      if (cartFound) {
        const rtaOk = {
          code: 200,
          status: 'success',
          details: { products: cartFound.products },
        };
        return rtaOk;
      } else {
        const rtaNotExist = {
          code: 404,
          status: 'Not exist',
          details: `Cart id ${id} Not exist`,
        };
        return rtaNotExist;
      }
    } catch (error) {
      const rtaError = {
        code: 404,
        status: 'error',
        details: error,
      };
      return rtaError;
    }
  }
  async updateCart(cartId, prodId) {
    try {
      //update entire product object based on id by parameter
      //find cart object by id
      console.log(`cartId: ${cartId} and prodId: ${prodId}`);
      let cartToUpdate = this.carts.findIndex((obj) => obj.id == cartId);
      console.log(`cartToUpdate: ${cartToUpdate}`);
      if (cartToUpdate != -1) {
        console.log(`Before prodToUpdate`);
        //if cart was found, find product id
        let prodToUpdate = this.carts[cartToUpdate].products.findIndex(
          (obj) => obj.prodId == prodId
        );
        //let prodToUpdate = this.carts[cartToUpdate];
        //let prodToUpdateString = JSON.stringify(prodToUpdate);
        //console.log(`prodToUpdateString: ${prodToUpdateString}`);
        console.log(`prodToUpdate: ${prodToUpdate}`);
        if (prodToUpdate != -1) {
          this.carts[cartToUpdate].products[prodToUpdate].quantity += 1;
        } else {
          const newProd = { prodId: prodId, quantity: 1 };
          this.carts[cartToUpdate].products.push(newProd);
        }
        //persist data into file
        const cartsString = JSON.stringify(this.carts); //convert array to string in order to persist data into file
        await fs.promises.writeFile(this.path, cartsString);
        //
        const updateCart = this.carts.filter((cart) => (cart.id = cartId));
        const rtaOk = {
          code: 200,
          status: 'success',
          details: `Success: Cart updated --> ${JSON.stringify(updateCart)}`,
        };
        return rtaOk;
      } else {
        const rtaNotExist = {
          code: 404,
          status: 'Not exist',
          details: `ERROR: Cart id ${cartId} doesn't exists to be updated`,
        };
        return rtaNotExist;
      }
    } catch (error) {
      const rtaError = {
        code: 404,
        status: 'error',
        details: error,
      };
      return rtaError;
    }
  }
} // export class CartManager {
