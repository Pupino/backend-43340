//@ts-check
//se usa @ts-check para q salten errores, es de typescript pero sirve para js
//import apis
//const fs = require('fs');
import fs from 'fs';

class Products {
  constructor() {
    this.path = './src/products.json'; //objects array, file to persist products
    this.products = [];
    //
    const productsString = fs.readFileSync(this.path, 'utf-8');
    const products = JSON.parse(productsString); //once file string is retrieved, parse it to obtain the original format (object, array, etc)
    //
    this.products = products;
  }

  async getAllProducts(plimit, ppage, psort, pquery) {
    //returns array with all created products
    try {
      console.log('Paso por linea' + ' 21');
      const productsString = await fs.promises.readFile(this.path, 'utf-8');
      console.log('productsString' + productsString);
      let products = JSON.parse(productsString); //once file string is retrieved, parse it to obtain the original format
      products = products.slice(0, plimit);
      return products;
    } catch (e) {
      return e;
    }
  }

  async createProduct(product) {
    //all fields are mandatory
    try {
      if (
        !product.title ||
        !product.description ||
        !product.code ||
        !product.price ||
        !product.stock ||
        !product.category
      ) {
        throw new Error(
          'All fields are mandatory: title, description, code, price, stock and category. Some is missing.'
        );
      }
      //code must be unique
      if (this.products.some((prod) => prod.code === product.code)) {
        throw new Error(`Product code '${product.code}' already exists.`);
      }

      let newProduct = {
        id: this.#generateId(), //product id
        title: product.title,
        description: product.description,
        code: product.code,
        price: product.price,
        stock: product.stock,
        category: product.category,
        thumbnails: product.thumbnails,
        status: product.status ?? true, //default true
      };
      //this.products = [...this.products, newProduct];
      this.products.push(newProduct);
      //persist data into file
      const productsString = JSON.stringify(this.products); //convert array to string in order to persist data into file
      await fs.promises.writeFile(this.path, productsString);
      return newProduct;
    } catch (e) {
      return e;
    }
    //
  }

  async updateProduct(id, product) {
    try {
      //update entire product object based on id by parameter
      //find product object by id
      let prodObjToUpdate = this.products.findIndex((obj) => obj.id == id);
      if (prodObjToUpdate != -1) {
        //if object was found update allowed properties
        this.products[prodObjToUpdate].title =
          product.title ?? this.products[prodObjToUpdate].title;
        this.products[prodObjToUpdate].description =
          product.description ?? this.products[prodObjToUpdate].description;
        this.products[prodObjToUpdate].price =
          product.price ?? this.products[prodObjToUpdate].price;
        this.products[prodObjToUpdate].stock =
          product.stock ?? this.products[prodObjToUpdate].stock;
        this.products[prodObjToUpdate].category =
          product.category ?? this.products[prodObjToUpdate].category;
        this.products[prodObjToUpdate].thumbnails =
          product.thumbnails ?? this.products[prodObjToUpdate].thumbnails;
        //this.products[prodObjToUpdate].code = prodObj.code; //this property can't be updated, act as id
        //persist data into file
        const productsString = JSON.stringify(this.products); //convert array to string in order to persist data into file
        await fs.promises.writeFile(this.path, productsString);
        //
        const newProduct = this.products.filter((prod) => (prod.id = id));
        return newProduct;
      } else {
        return '';
      }
    } catch (e) {
      return e;
    }
  }

  async deleteProduct(id) {
    try {
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
        const rtaOk = {
          acknowledged: true,
          deletedCount: 1,
        };
        return rtaOk;
      } else {
        return '';
      }
    } catch (e) {
      return e;
    }
  }

  async getProductById(id) {
    //returns product object by id, in case not found show --> console.log('Not found');
    try {
      const productsString = await fs.promises.readFile(this.path, 'utf-8');
      let products = JSON.parse(productsString); //once file string is retrieved, parse it to obtain the original format
      const prodFound = this.products.find((prod) => prod.id == id);
      return prodFound;
    } catch (e) {
      return e;
    }
  }

  //internal functions
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

  async validateUniqueCode(code) {
    //code must be unique
    //Find one product whose 'code' is parameter sent, otherwise `null`
    try {
      const productsString = await fs.promises.readFile(this.path, 'utf-8');
      let products = JSON.parse(productsString); //once file string is retrieved, parse it to obtain the original
      console.log('validateUniqueCode: ' + code);
      if (products.some((prod) => prod.code === code)) {
        return 'exists';
      }
    } catch (e) {
      return e;
    }
  }
} // export class ProductManager {

export const productsModel = new Products();
