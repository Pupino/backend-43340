//@ts-check
//se usa @ts-check para q salten errores, es de typescript pero sirve para js
//import apis
//const fs = require('fs');
import fs from 'fs';

export default class Carts {
  constructor() {
    this.path = './src/carts.json'; //objects array, file to persist carts
    this.carts = [];
    //
    const cartsString = fs.readFileSync(this.path, 'utf-8');
    const carts = JSON.parse(cartsString); //once file string is retrieved, parse it to obtain the original format (object, array, etc)
    //
    this.carts = carts;
  }

  async getAllCarts() {
    //returns products array belong to cart id
    try {
      const cartsString = await fs.promises.readFile(this.path, 'utf-8');
      let carts = JSON.parse(cartsString); //once file string is retrieved, parse it to obtain the original format
      //Romina: en este paso hacer que se populen los productos con sus descripciones, como hace mongo!
      return carts;
    } catch (e) {
      return e;
    }
  }

  async getCartByUserId(uid) {
    //returns cart belong to user id
    try {
      const cartsString = await fs.promises.readFile(this.path, 'utf-8');
      let carts = JSON.parse(cartsString); //once file string is retrieved, parse it to obtain the original format
      const cartFound = this.carts.find((cart) => cart.userId == uid);
      console.log('line 55: ' + JSON.stringify(cartFound));
      let cartArray = [];
      cartArray.push(cartFound);
      return cartArray;
    } catch (e) {
      return e;
    }
  }

  async addCart() {
    //all fields are mandatory
    try {
      let newCart = {
        id: this.#generateId(), //cart id
        productsArray: [],
      };
      //this.productsArray = [...this.carts, newCart];
      this.carts.push(newCart);
      //persist data into file
      const cartsString = JSON.stringify(this.carts); //convert array to string in order to persist data into file
      await fs.promises.writeFile(this.path, cartsString);
      return newCart;
    } catch (e) {
      console.error(e);
      return e;
    }
    //
  }

  async getProductsByCartId(id) {
    //returns productsArray array belong to cart id
    try {
      const cartsString = await fs.promises.readFile(this.path, 'utf-8');
      let carts = JSON.parse(cartsString); //once file string is retrieved, parse it to obtain the original format
      const cartFound = this.carts.find((cart) => cart.id == id);
      console.log('line 55: ' + JSON.stringify(cartFound));
      return cartFound;
    } catch (e) {
      return e;
    }
  }

  async updateProdsOnCart(cid, prodsArray) {
    //prodsArray tendra dentro prodId,quantity
    try {
      //update entire product object based on id by parameter
      //find cart object by id
      console.log(
        `cartId: ${cid} and prodsArray: ${JSON.stringify(prodsArray)}`
      );
      let cartToUpdate = this.carts.findIndex((obj) => obj.id == cid);
      console.log(`cartToUpdate: ${cartToUpdate}`);
      if (cartToUpdate != -1) {
        console.log(`Before prodToUpdate`);
        //if cart was found, loop on prodsArray array to find each product id and update quantity
        prodsArray.forEach((prod, i) => {
          console.log(
            'prod.prodId',
            prod.prodId + ' prod.quantity',
            prod.quantity
          );

          let prodToUpdate = this.carts[cartToUpdate].productsArray.findIndex(
            (obj) => obj.prodId == prod.prodId
          );
          //let prodToUpdate = this.carts[cartToUpdate];
          //let prodToUpdateString = JSON.stringify(prodToUpdate);
          //console.log(`prodToUpdateString: ${prodToUpdateString}`);
          console.log(`prodToUpdate: ${prodToUpdate}`);
          if (prodToUpdate != -1) {
            this.carts[cartToUpdate].productsArray[prodToUpdate].quantity =
              prod.quantity;
          } else {
            const newProd = { prodId: prod.prodId, quantity: prod.quantity };
            this.carts[cartToUpdate].productsArray.push(newProd);
          }
        });
        //persist data into file
        const cartsString = JSON.stringify(this.carts); //convert array to string in order to persist data into file
        await fs.promises.writeFile(this.path, cartsString);
        //
        const updateCart = this.carts.filter((cart) => (cart.id = cid));
        return updateCart;
      } else {
        return '';
      }
    } catch (e) {
      return e;
    }
  }

  async updateProdQtyOnCart(cid, pid, prodQuantity) {
    try {
      //update entire product object based on id by parameter
      //find cart object by id
      console.log(`DAO memory cid: ${cid} and prodId: ${pid}`);
      let cartToUpdate = this.carts.findIndex((obj) => obj.id == cid);
      console.log(`cartToUpdate: ${cartToUpdate}`);
      if (cartToUpdate != -1) {
        console.log(`Before prodToUpdate`);
        //if cart was found, find product id
        let prodToUpdate = this.carts[cartToUpdate].productsArray.findIndex(
          (obj) => obj.prodId == pid
        );
        //let prodToUpdate = this.carts[cartToUpdate];
        //let prodToUpdateString = JSON.stringify(prodToUpdate);
        //console.log(`prodToUpdateString: ${prodToUpdateString}`);
        console.log(`prodToUpdate: ${prodToUpdate}`);
        if (prodToUpdate != -1) {
          this.carts[cartToUpdate].productsArray[prodToUpdate].quantity =
            prodQuantity;
        } else {
          const newProd = { prodId: pid, quantity: prodQuantity };
          this.carts[cartToUpdate].productsArray.push(newProd);
        }
        //persist data into file
        const cartsString = JSON.stringify(this.carts); //convert array to string in order to persist data into file
        await fs.promises.writeFile(this.path, cartsString);
        //
        const updateCart = this.carts.filter((cart) => (cart.id = cid));
        return updateCart;
      } else {
        return '';
      }
    } catch (e) {
      return e;
    }
  }

  async deleteProd(cid, pid) {
    try {
      //update entire product object based on id by parameter
      //find cart object by id
      console.log(`cid: ${cid} and prodId: ${pid}`);
      let cartToUpdate = this.carts.findIndex((obj) => obj.id == cid);
      console.log(`cartToUpdate: ${cartToUpdate}`);
      if (cartToUpdate != -1) {
        console.log(`Before prodToUpdate`);
        //if cart was found, find product id
        let prodToUpdate = this.carts[cartToUpdate].productsArray.findIndex(
          (obj) => obj.prodId == pid
        );
        //let prodToUpdate = this.carts[cartToUpdate];
        //let prodToUpdateString = JSON.stringify(prodToUpdate);
        //console.log(`prodToUpdateString: ${prodToUpdateString}`);
        console.log(`prodToUpdate: ${prodToUpdate}`);
        if (prodToUpdate != -1) {
          //this.carts[cartToUpdate].products[prodToUpdate].quantity = 0;
          this.carts[cartToUpdate].productsArray.splice(prodToUpdate, 1);
        } else {
          const rtaNotExist = {
            code: 404,
            status: 'Not exist',
            details: `ERROR: Cart id ${cid} doesn't have pid ${pid} to be updated`,
          };
          return rtaNotExist;
        }
        //persist data into file
        const cartsString = JSON.stringify(this.carts); //convert array to string in order to persist data into file
        await fs.promises.writeFile(this.path, cartsString);
        //
        const updateCart = this.carts.filter((cart) => (cart.id = cid));
        return updateCart;
      } else {
        return '';
      }
    } catch (e) {
      return e;
    }
  }

  async deleteAllProds(cid) {
    try {
      //update entire product object based on id by parameter
      //find cart object by id
      console.log(`cid: ${cid}`);
      let cartToUpdate = this.carts.findIndex((obj) => obj.id == cid);
      console.log(`cartToUpdate: ${cartToUpdate}`);
      if (cartToUpdate != -1) {
        console.log(`Before prodToUpdate`);
        //if cart was found, empty products array
        this.carts[cartToUpdate].productsArray = [];
        //persist data into file
        const cartsString = JSON.stringify(this.carts); //convert array to string in order to persist data into file
        await fs.promises.writeFile(this.path, cartsString);
        //
        const updateCart = this.carts.filter((cart) => (cart.id = cid));
        return updateCart;
      } else {
        return '';
      }
    } catch (e) {
      return e;
    }
  }

  //internal functions
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
} // export class CartManager {

//export const cartsModel = new Carts();

/*
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
  */
