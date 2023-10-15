//@ts-check
import { productsModel } from '../dao/factory.js';
//import { productsModel } from '../dao/mongo/products.mongo.js';
//import { productsModel } from '../dao/memory/products.memory.js';
import ProductDTO from '../dao/DTO/product.dto.js';
import CustomError from '../services/errors/custom-error.js';
import EErros from '../services/errors/enum.js';
import { createProductErrorInfo } from '../services/errors/info.js';
import { logger } from '../Utils/logger.js';
import { sendEmailTransport } from '../Utils/messaging.js';
import { entorno } from '../config.js';

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
      throw new Error(createProductErrorInfo(product));
      // CustomError.createError({
      //   name: 'Product Creation Validation',
      //   cause: createProductErrorInfo(product),
      //   message: 'Some field is missed, check cause.',
      //   code: EErros.CREATE_PRODUCT_ERROR,
      // });
    }
  }
  async validateUniqueCode(code) {
    //code must be unique
    //Find one product whose 'code' is parameter sent, otherwise `null`
    const exists = await productsModel.validateUniqueCode(code);
    if (exists) {
      throw new Error(`Product code '${code}' already exists.`);
      // CustomError.createError({
      //   name: 'Product Unique Code Validation',
      //   cause: `Product code '${code}' already exists.`,
      //   message: 'Code must be unique',
      //   code: EErros.CREATE_PRODUCT_ERROR,
      // });
    }
  }
  async validateIdExists(id) {
    try {
      const exists = await productsModel.getProductById(id);
      if (!exists) {
        throw new Error(`Product id '${id}' doesn't exists.`);
        // CustomError.createError({
        //   name: 'ID Product validation error',
        //   cause: `Product id '${id}' doesn't exists.`,
        //   message: 'Error trying to validate a product id',
        //   code: EErros.PRODUCT_ID_VALIDATION,
        // });
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
      throw e;
    }
  }
  //returns product object by id
  async getProductById(id) {
    try {
      const product = await productsModel.getProductById(id);
      return product;
    } catch (e) {
      throw e;
    }
  }
  async createProduct(product, isPremiumUser, emailUser) {
    try {
      this.validatePostProduct(product);
      await this.validateUniqueCode(product.code);
      //If user is premium, set product.owner as email user, otherwise product.owner = 'admin';
      if (isPremiumUser) {
        product.owner = emailUser;
      } else {
        product.owner = 'admin';
      }
      const productCreated = await productsModel.createProduct(product);
      let rta = {
        status: 200,
        productCreated,
        redirect: '/api/products',
      };
      //return productCreated;
      return rta;
    } catch (e) {
      throw e;
    }
  }
  //update a product by id
  async updateProduct(id, product, isAdminUser, isPremiumUser, emailUser) {
    try {
      await this.validateIdExists(id);
      //Conseguir el owner del producto acá
      const originalProd = await productsModel.getProductById(id);
      logger.debug(`isPremiumUser: ${isPremiumUser}`);
      logger.debug(`product.owner: ${originalProd.owner}`);
      logger.debug(`emailUser: ${emailUser}`);
      if (isAdminUser || (isPremiumUser && originalProd.owner === emailUser)) {
        const prodUptaded = await productsModel.updateProduct(
          { _id: id },
          product
        );
        return prodUptaded;
      } else {
        throw new Error(
          `Product id '${id}'can't be updated since you're not Admin or not Owner of product.`
        );
        // CustomError.createError({
        //   name: 'Update Product validation error',
        //   cause: `Product id '${id}'can't be updated since you're not Admin or not Owner of product.`,
        //   message: `Product id '${id}'can't be updated since you're not Admin or not Owner of product.`,
        //   code: EErros.PRODUCT_UPDATE_VALIDATION_ERROR,
        // });
      }
    } catch (e) {
      throw e;
    }
  }

  async deleteProduct(id, isAdminUser, isPremiumUser, emailUser) {
    try {
      await this.validateIdExists(id);
      //Conseguir el owner del producto acá
      const originalProd = await productsModel.getProductById(id);
      logger.debug(`isPremiumUser: ${isPremiumUser}`);
      logger.debug(`product.owner: ${originalProd.owner}`);
      logger.debug(`emailUser: ${emailUser}`);
      if (isAdminUser || (isPremiumUser && originalProd.owner === emailUser)) {
        const prodDeleted = await productsModel.deleteProduct({ _id: id });
        //enviar mail si el owner es un mail de usuario
        if (originalProd.owner !== 'admin') {
          //send email to owner
          const result = await sendEmailTransport.sendMail({
            from: entorno.GOOGLE_EMAIL,
            to: originalProd.owner,
            subject: `Product ${originalProd.title} was deleted`,
            html: `<div>
                        <p>Hi, the product ${originalProd.title} that belongs to you was removed</p>
                        <br>
                        <p>Is just a notification to be aware.</p>
                      </div>`,
          });
        }
        return prodDeleted;
      } else {
        throw new Error(
          `Product id '${id}'can't be Delete since you're not Admin or not Owner of product.`
        );
        // CustomError.createError({
        //   name: 'Delete Product validation error',
        //   cause: `Product id '${id}'can't be Delete since you're not Admin or not Owner of product.`,
        //   message: `Product id '${id}'can't be Delete since you're not Admin or not Owner of product.`,
        //   code: EErros.PRODUCT_DELETE_VALIDATION_ERROR,
        // });
      }
    } catch (e) {
      throw e;
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
