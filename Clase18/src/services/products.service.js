//@ts-check
import { productsModel } from '../dao/factory.js';
//import { productsModel } from '../dao/mongo/products.mongo.js';
//import { productsModel } from '../dao/memory/products.memory.js';
import ProductDTO from '../dao/DTO/product.dto.js';
import CustomError from '../services/errors/custom-error.js';
import EErros from '../services/errors/enum.js';
import { createProductErrorInfo } from '../services/errors/info.js';

class ProductService {
  validatePostProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.stock ||
      !product.category
    ) {
      CustomError.createError({
        name: 'Product Creation Validation',
        cause: createProductErrorInfo(product),
        message: 'Some field is missed, check cause.',
        code: EErros.CREATE_PRODUCT_ERROR,
      });
    }
  }
  async validateUniqueCode(code) {
    //code must be unique
    //Find one product whose 'code' is parameter sent, otherwise `null`
    const exists = await productsModel.validateUniqueCode(code);
    if (exists) {
      CustomError.createError({
        name: 'Product Unique Code Validation',
        cause: `Product code '${code}' already exists.`,
        message: 'Code must be unique',
        code: EErros.CREATE_PRODUCT_ERROR,
      });
    }
  }
  async validateIdExists(id) {
    try {
      const exists = await productsModel.getProductById(id);
      if (!exists) {
        CustomError.createError({
          name: 'ID Product validation error',
          cause: `Product id '${id}' doesn't exists.`,
          message: 'Error trying to validate a product id',
          code: EErros.PRODUCT_ID_VALIDATION,
        });
      }
    } catch (e) {
      throw e;
    }
  }
  //returns all products object
  async getAllProducts(plimit, ppage, psort, pquery) {
    try {
      let query;
      if (pquery) {
        query = { code: pquery };
      }
      const products = await productsModel.getAllProducts(
        plimit,
        ppage,
        psort,
        pquery
      );
      let productsDTO = products.map((product) => new ProductDTO(product));
      productsDTO.totalPages = products.totalPages;
      productsDTO.products = products.products;
      productsDTO.totalDocs = products.totalDocs;
      productsDTO.limit = products.limit;
      productsDTO.pagingCounter = products.pagingCounter;
      productsDTO.page = products.page;
      productsDTO.hasPrevPage = products.hasPrevPage;
      productsDTO.hasNextPage = products.hasNextPage;
      productsDTO.prevPage = products.prevPage;
      productsDTO.nextPage = products.nextPage;
      return productsDTO;
    } catch (e) {
      CustomError.createError({
        name: 'Get All Products error',
        cause: 'Contact Development team',
        message: e,
        code: EErros.GET_ALL_PRODUCTS_ERROR,
      });
    }
  }
  //returns product object by id
  async getProductById(id) {
    try {
      const product = await productsModel.getProductById(id);
      return product;
    } catch (e) {
      CustomError.createError({
        name: 'Get product by ID error',
        cause: `Some issue related to product ID ${id}.`,
        message: e,
        code: EErros.GET_PRODUCT_BY_ID_ERROR,
      });
    }
  }
  async createProduct(product) {
    try {
      this.validatePostProduct(product);
      await this.validateUniqueCode(product.code);
      const productCreated = await productsModel.createProduct(product);
      return productCreated;
    } catch (e) {
      CustomError.createError({
        name: 'Create Product error 112',
        cause: e.cause,
        message: e,
        code: EErros.CREATE_PRODUCT_ERROR,
      });
    }
  }
  //update a product by id
  async updateProduct(id, product) {
    try {
      await this.validateIdExists(id);
      const prodUptaded = await productsModel.updateProduct(
        { _id: id },
        product
      );
      return prodUptaded;
    } catch (e) {
      throw e;
    }
  }

  async deleteProduct(id) {
    try {
      await this.validateIdExists(id);
      const prodDeleted = await productsModel.deleteProduct({ _id: id });
      return prodDeleted;
    } catch (e) {
      CustomError.createError({
        name: 'Delete product error',
        cause: 'Contact Development team',
        message: e,
        code: EErros.DELETE_PRODUCT_ERROR,
      });
    }
  }

  createProductForm() {
    let rta = {
      status: 200,
      render: 'create-product-form',
      msg: '',
    };
    return rta;
  }
}

export const productService = new ProductService();
