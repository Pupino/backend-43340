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

  async addProduct(product) {
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
        const rta = {
          code: 400,
          status: 'error',
          details:
            'All fields are mandatory: title, description, code, price, stock and category. Some is missing.',
        };
        return rta;
      }
      //code must be unique
      if (this.products.some((prod) => prod.code === product.code)) {
        const rta = {
          code: 400,
          status: 'error',
          details: `Product code '${product.code}' already exists.`,
        };
        return rta;
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
      //
      const rta = {
        code: 200,
        status: 'success',
        details: `Product Created! New Product data: ${JSON.stringify(
          newProduct
        )}`,
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
  async getProducts(limit) {
    //returns array with all created products
    try {
      const productsString = await fs.promises.readFile(this.path, 'utf-8');
      let products = JSON.parse(productsString); //once file string is retrieved, parse it to obtain the original format
      products = products.slice(0, limit);
      const rtaOk = {
        code: 200,
        status: 'success',
        details: products,
      };
      return rtaOk;
    } catch (error) {
      const rtaError = {
        code: 404,
        status: 'error',
        details: error,
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
          details: prodFound,
        };
        return rtaOk;
      } else {
        const rtaNotExist = {
          code: 404,
          status: 'Not exist',
          details: `Product id ${id} Not exist`,
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
  async updateProduct(pid, prodObj) {
    try {
      //update entire product object based on id by parameter
      //find product object by id
      let prodObjToUpdate = this.products.findIndex((obj) => obj.id == pid);
      if (prodObjToUpdate != -1) {
        //if object was found update allowed properties
        this.products[prodObjToUpdate].title =
          prodObj.title ?? this.products[prodObjToUpdate].title;
        this.products[prodObjToUpdate].description =
          prodObj.description ?? this.products[prodObjToUpdate].description;
        this.products[prodObjToUpdate].price =
          prodObj.price ?? this.products[prodObjToUpdate].price;
        this.products[prodObjToUpdate].stock =
          prodObj.stock ?? this.products[prodObjToUpdate].stock;
        this.products[prodObjToUpdate].category =
          prodObj.category ?? this.products[prodObjToUpdate].category;
        this.products[prodObjToUpdate].thumbnails =
          prodObj.thumbnails ?? this.products[prodObjToUpdate].thumbnails;
        //this.products[prodObjToUpdate].code = prodObj.code; //this property can't be updated, act as id
        //persist data into file
        const productsString = JSON.stringify(this.products); //convert array to string in order to persist data into file
        await fs.promises.writeFile(this.path, productsString);
        //
        const newProduct = this.products.filter((prod) => (prod.id = pid));
        const rtaOk = {
          code: 200,
          status: 'success',
          details: `Success: Product updated --> ${JSON.stringify(newProduct)}`,
        };
        return rtaOk;
      } else {
        const rtaNotExist = {
          code: 404,
          status: 'Not exist',
          details: `ERROR: Product id ${pid} doesn't exists to be updated`,
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
          code: 200,
          status: 'success',
          details: `Success: Product ${id} deleted!`,
        };
        return rtaOk;
      } else {
        const rtaNotExist = {
          code: 404,
          status: 'Not exist',
          details: `ERROR: Product id ${id} doesn't exists to be deleted`,
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
} // export class ProductManager {
