//@ts-check
//se usa @ts-check para q salten errores, es de typescript pero sirve para js
//import apis
const fs = require('fs');

class ProductManager {
  constructor() {
    this.path = 'products.json'; //objects array, file to persist products
    this.products = [];
    const productsString = fs.readFileSync(this.path, 'utf-8');
    //once file string is retrieved, parse it to obtain json notation
    const products = JSON.parse(productsString);
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
  addProduct(title, description, price, thumbnail, code, stock) {
    //all fields are mandatory
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      return console.log(`Error: All fields are mandatory.`);
    }
    //code must be unique
    for (let index = 0; index < this.products.length; index++) {
      const prodCode = this.products[index].code;
      if (prodCode === code) {
        return console.log(`Error: product code ${code} already exists.`);
      }
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
    this.products = [...this.products, newProduct];
    //convert array to string in order to persist data into file
    const productsString = JSON.stringify(this.products);
    fs.writeFileSync(this.path, productsString);
    return console.log(`Product code ${code} successfully added!`);
  }
  getProducts() {
    //returns array with all created products
    return console.log(this.products);
  }
  getProductById(id) {
    //returns product object by id, in case not found show --> console.log('Not found');
    const prodFound = this.products.find((prod) => prod.id == id);
    if (prodFound) {
      console.log(`Product id ${id} is: ${JSON.stringify(prodFound)}`);
      return prodFound;
    } else {
      return console.log(`Product id ${id} Not found`);
    }
  }
  updateProduct(id, prodObj) {
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
      //convert array to string in order to persist modified data into file
      const productsString = JSON.stringify(this.products);
      fs.writeFileSync(this.path, productsString);
      return console.log(`Product id ${id} successfully updated!`);
    } else {
      return console.error(
        `ERROR: Product id ${id} doesn't exists to be updated`
      );
    }
  }
  deleteProduct(id) {
    //delete product based on id by parameter
    //find product object by id
    let prodObjToDelete = this.products.findIndex((obj) => obj.id == id);
    if (prodObjToDelete != -1) {
      //if object was found remove it
      this.products.splice(prodObjToDelete, 1);
      //convert array to string in order to persist modified data into file
      const productsString = JSON.stringify(this.products);
      fs.writeFileSync(this.path, productsString);
      return console.log(`Product id ${id} successfully deleted!`);
    } else {
      return console.error(
        `ERROR: Product id ${id} doesn't exists to be deleted`
      );
    }
  }
}
//TESTING CODE
//create product manager instance
const store = new ProductManager();
//check products from store instance
store.getProducts();
//create product
store.addProduct(
  'producto prueba',
  'Este es un producto prueba',
  200,
  'Sin imagen',
  'abc123',
  25
);
//check products from store instance once before created
store.getProducts();
//create same product again
store.addProduct(
  'producto prueba',
  'Este es un producto prueba',
  200,
  'Sin imagen',
  'abc123',
  25
);
//search product id 1 already creted
store.getProductById(1);
//search product that does not exist: id 082
store.getProductById(082);
//update product id 1
store.updateProduct(1, {
  title: 'producto prueba UPDATED',
  description: 'Este es un producto prueba',
  price: 250,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 2,
});
//update product with wrong id
store.updateProduct(2029, {
  title: 'producto que NO EXISTE',
  description: 'Este es un producto prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25,
});
//remove product id 1
store.deleteProduct(1);
//remove product with wrong id
store.deleteProduct(555);
