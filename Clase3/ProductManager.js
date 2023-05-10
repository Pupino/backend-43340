//@ts-check
//se usa @ts-check para q salten errores, es de typescript pero sirve para js
//import apis
const fs = require('fs');

class ProductManager {
  constructor() {
    this.path = 'products.json'; //objects array, file to persist products
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
  getProducts() {
    //returns array with all created products
    return console.log(
      `Get Products response: ${JSON.stringify(this.products)}`
    );
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
//TESTING CODE
async function test() {
  //create product manager instance
  const store = new ProductManager();
  //check products from store instance
  store.getProducts();
  //create product
  await store.addProduct(
    'Producto A',
    'Testing',
    200,
    'Sin imagen',
    'abc123',
    25
  );
  //check products from store instance once before created
  store.getProducts();
  //create same product again
  await store.addProduct(
    'Lala',
    'Lala testing',
    899,
    'Sin imagen',
    'abc123',
    70
  );
  //search product id 1 already creted
  await store.getProductById(1);
  //search product that does not exist: id 082
  await store.getProductById(082);
  //update product id 1
  await store.updateProduct(1, {
    title: 'Titulo Updeteado',
    description: 'Testing',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 24,
  });
  //update product with wrong id
  await store.updateProduct(2029, {
    title: 'producto que NO EXISTE',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25,
  });
  //remove product id 1
  await store.deleteProduct(1);
  //remove product with wrong id
  await store.deleteProduct(555);
  //add new product
  await store.addProduct('Grisi', 'Test', 9999999, 'Sin imagen', 'grs10', 1);
}

test();
