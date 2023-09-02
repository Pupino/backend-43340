import { ProductModel } from './models/products.model.js';

export default class Products {
  //returns all products object
  async getAllProducts(plimit, ppage, psort, pquery) {
    //const products = await ProductModel.find().lean(); //adding lean() to get a json object (instead of a mongoose one), otherwise handlebars issue appears
    let query;
    if (pquery) {
      query = { code: pquery };
    }
    const products = await ProductModel.paginate(
      {},
      { limit: /*  limit || */ 10, page: ppage || 1 }
      //query || {}, //tomar esto dinamicamente mediante el parámetro pquery
      //{ limit: plimit || 10, page: ppage || 1, sort: { price: psort } }
    );
    let finalProducts;
    finalProducts = products.docs;
    finalProducts.totalPages = products.totalPages;
    finalProducts.products = products.products;
    finalProducts.totalDocs = products.totalDocs;
    finalProducts.limit = products.limit;
    finalProducts.pagingCounter = products.pagingCounter;
    finalProducts.page = products.page;
    finalProducts.hasPrevPage = products.hasPrevPage;
    finalProducts.hasNextPage = products.hasNextPage;
    finalProducts.prevPage = products.prevPage;
    finalProducts.nextPage = products.nextPage;
    return finalProducts;
  }
  //returns product object by id
  async getProductById(id) {
    const product = await ProductModel.findById(id);
    return product;
  }

  async createProduct(product) {
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
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.stock ||
      !product.category
    ) {
      throw 'Validation Product ERROR, some required field is missed';
    }
  }

  async validateUniqueCode(code) {
    //code must be unique
    //Find one product whose 'code' is parameter sent, otherwise `null`
    try {
      const exists = await ProductModel.findOne({ code: code }).exec();
      return exists;
    } catch (e) {
      return e;
    }
  }

  async validateIdExists(id) {
    const exists = await ProductModel.findById(id);
    if (!exists) {
      throw `Product id '${id}' doesn't exists.`;
    }
  }
}

//export const productsModel = new Products();
