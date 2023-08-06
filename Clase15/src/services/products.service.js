//@ts-check
import { productsModel } from '../dao/mongo/products.mongo.js';
//import { productsModel } from '../dao/memory/products.memory.js';
import { ConnectionError, ValidationError } from '../errors.js';
import ProductDTO from '../dao/DTO/product.dto.js';

class ProductService {
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
      throw new ValidationError();
    }
  }
  async validateUniqueCode(code) {
    //code must be unique
    //Find one product whose 'code' is parameter sent, otherwise `null`
    console.log('validateUniqueCode: ' + code);
    const exists = await productsModel.validateUniqueCode(code);
    if (exists) {
      console.log(`Product code '${code}' already exists.`);
      throw 'VALIDATION ERROR';
    }
  }
  async validateIdExists(id) {
    const exists = await productsModel.getProductById(id);
    if (!exists) {
      console.log(`Product id '${id}' doesn't exists.`);
      throw 'VALIDATION ERROR';
    }
  }
  //returns all products object
  async getAllProducts(plimit, ppage, psort, pquery) {
    let query;
    if (pquery) {
      query = { code: pquery };
    }
    let products = await productsModel.getAllProducts(
      plimit,
      ppage,
      psort,
      pquery
    );
    products = products.map((product) => new ProductDTO(product));
    return products;
  }
  //returns product object by id
  async getProductById(id) {
    const product = await productsModel.getProductById(id);
    return product;
  }
  async createProduct(product) {
    try {
      console.log('createProduct: ' + JSON.stringify(product));
      this.validatePostProduct(product);
      await this.validateUniqueCode(product.code);
      const productCreated = await productsModel.createProduct(product);
      return productCreated;
    } catch (e) {
      if (e instanceof ValidationError) {
        throw e;
      }
    }
  }
  //update a product by id
  async updateProduct(id, product) {
    await this.validateIdExists(id);
    const prodUptaded = await productsModel.updateProduct({ _id: id }, product);
    return prodUptaded;
  }

  async deleteProduct(id) {
    await this.validateIdExists(id);
    const prodDeleted = await productsModel.deleteProduct({ _id: id });
    return prodDeleted;
  }
}

export const productService = new ProductService();
