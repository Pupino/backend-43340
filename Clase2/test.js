//@ts-check
class ProductManager {
  constructor() {
    this.products = [];
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
