//@ts-check
//se usa @ts-check para q salten errores, es de typescript pero sirve para js
//import apis
//const fs = require('fs');
import fs from 'fs';

export class ProductManager {
  constructor() {
    this.path = './src/products.json'; //objects array, file to persist products
    this.products = [];
    //
    const productsString = fs.readFileSync(this.path, 'utf-8');
    const products = JSON.parse(productsString); //once file string is retrieved, parse it to obtain the original format (object, array, etc)
    //
    this.products = products;
  }
  #generateId() {
    let maxId = 0;
    for (let index = 0; index < this.products.length; index++) {
      const product = this.products[index];
      if (product.id > maxId) {
        maxId = product.id;
      }
    }
    return ++maxId;
  }
  async addProduct(title, description, price, thumbnail, code, stock) {
    //all fields are mandatory
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      return console.error(`Error: All fields are mandatory.`);
    }
    //code must be unique
    if (this.products.some((product) => product.code === code)) {
      return console.error(`Error: Product code ${code} already exists.`);
    }

    let newProduct = {
      title, //product name
      description, //product description
      price, //product price
      thumbnail, //product image path
      code, //product code
      stock, //product stock
      id: this.#generateId(), //product id
    };
    //this.products = [...this.products, newProduct];
    this.products.push(newProduct);
    //persist data into file
    const productsString = JSON.stringify(this.products); //convert array to string in order to persist data into file
    await fs.promises.writeFile(this.path, productsString);
    //
    return console.log(
      `Success: New product ${JSON.stringify(newProduct)} was created!`
    );
    //
  }
  async getProducts(limit) {
    //returns array with all created products
    try {
      const productsString = await fs.promises.readFile(this.path, 'utf-8');
      let products = JSON.parse(productsString); //once file string is retrieved, parse it to obtain the original format
      products = products.slice(0, limit);
      const rtaOk = {
        code: 200,
        status: 'success',
        message: products,
      };
      return rtaOk;
    } catch (error) {
      const rtaError = {
        code: 404,
        status: 'error',
        message: error,
      };
      return rtaError;
    }
  }
  async getProductById(id) {
    //returns product object by id, in case not found show --> console.log('Not found');
    try {
      const productsString = await fs.promises.readFile(this.path, 'utf-8');
      let products = JSON.parse(productsString); //once file string is retrieved, parse it to obtain the original format
      const prodFound = this.products.find((prod) => prod.id == id);
      if (prodFound) {
        const rtaOk = {
          code: 200,
          status: 'success',
          message: prodFound,
        };
        return rtaOk;
      } else {
        const rtaNotExist = {
          code: 404,
          status: 'Not exist',
          message: `Product id ${id} Not exist`,
        };
        return rtaNotExist;
      }
    } catch (error) {
      const rtaError = {
        code: 404,
        status: 'error',
        message: error,
      };
      return rtaError;
    }
  }
  async updateProduct(id, prodObj) {
    //update entire product object based on id by parameter
    //find product object by id
    let prodObjToUpdate = this.products.findIndex((obj) => obj.id == id);
    if (prodObjToUpdate != -1) {
      //if object was found update allowed properties
      this.products[prodObjToUpdate].title = prodObj.title;
      this.products[prodObjToUpdate].description = prodObj.description;
      this.products[prodObjToUpdate].price = prodObj.price;
      this.products[prodObjToUpdate].thumbnail = prodObj.thumbnail;
      //this.products[prodObjToUpdate].code = prodObj.code; //this property can't be updated, act as id
      this.products[prodObjToUpdate].stock = prodObj.stock;
      //persist data into file
      const productsString = JSON.stringify(this.products); //convert array to string in order to persist data into file
      await fs.promises.writeFile(this.path, productsString);
      //
      const newProduct = this.products.filter((prod) => (prod.id = id));
      return console.log(
        `Success: Product updated --> ${JSON.stringify(newProduct)}`
      );
    } else {
      return console.error(
        `ERROR: Product id ${id} doesn't exists to be updated`
      );
    }
  }
  async deleteProduct(id) {
    //delete product based on id by parameter
    //find product object by id
    //let prodObjToDelete = this.products.findIndex((obj) => obj.id == id);
    //productos = productos.filter((p) => p.id != id);
    let prodObjToDelete = this.products.filter((p) => p.id == id);
    if (prodObjToDelete.length > 0) {
      //if object was found remove it
      this.products = this.products.filter((p) => p.id != id); //remove id from array
      //persist data into file
      const productsString = JSON.stringify(this.products); //convert array to string in order to persist data into file
      await fs.promises.writeFile(this.path, productsString);
      //
      return console.log(`Success: Product ${id} deleted!`);
    } else {
      return console.error(
        `ERROR: Product id ${id} doesn't exists to be deleted`
      );
    }
  }
}
