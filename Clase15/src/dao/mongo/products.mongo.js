//@ts-check
import { ProductModel } from './models/products.model.js';

class Products {
  //returns all products object
  async getAllProducts(plimit, ppage, psort, pquery) {
    //const products = await ProductModel.find().lean(); //adding lean() to get a json object (instead of a mongoose one), otherwise handlebars issue appears
    let query;
    if (pquery) {
      query = { code: pquery };
    }
    const products = await ProductModel.paginate(
      query || {}, //tomar esto dinamicamente mediante el parámetro pquery
      { limit: plimit || 10, page: ppage || 1, sort: { price: psort } }
    );
    return products.docs;
  }
  //returns product object by id
  async getProductById(id) {
    const product = await ProductModel.findById(id);
    return product;
  }

  async createProduct(product) {
    console.log('createProduct: ' + JSON.stringify(product));
    this.validatePostProduct(product);
    await this.validateUniqueCode(product.code);
    const productCreated = await ProductModel.create(product);
    return productCreated;
  }

  //update a product by id
  async updateProduct(id, product) {
    //const product = await ProductModel.findById(id);
    await this.validateIdExists(id);
    const prodUptaded = await ProductModel.updateOne({ _id: id }, product);
    return prodUptaded;
  }

  async deleteProduct(id) {
    await this.validateIdExists(id);
    const prodDeleted = await ProductModel.deleteOne({ _id: id });
    return prodDeleted;
  }
  //internal functions
  validatePostProduct(product) {
    console.log('validatePostProduct product: ' + JSON.stringify(product));
    console.log('product.title: ' + product.title);
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.stock ||
      !product.category
    ) {
      console.log(
        'All fields are mandatory: title, description, code, price, stock and category. Some is missing.'
      );
      throw 'VALIDATION ERROR';
    }
  }

  async validateUniqueCode(code) {
    //code must be unique
    //Find one product whose 'code' is parameter sent, otherwise `null`
    try {
      console.log('validateUniqueCode: ' + code);
      const exists = await ProductModel.findOne({ code: code }).exec();
      return exists;
    } catch (e) {
      return e;
    }
  }

  async validateIdExists(id) {
    const exists = await ProductModel.findById(id);
    if (!exists) {
      console.log(`Product id '${id}' doesn't exists.`);
      throw 'VALIDATION ERROR';
    }
  }
}

export const productsModel = new Products();
