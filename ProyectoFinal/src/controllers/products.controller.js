//@ts-check
import { productService } from '../services/products.service.js';
import CustomError from '../services/errors/custom-error.js';
import EErros from '../services/errors/enum.js';
import { logger } from '../Utils/logger.js';

class ProductController {
  async getProducts(req, res) {
    try {
      const query = req.query;
      const plimit = query.limit;
      const ppage = query.page;
      const psort = query.sort;
      const pquery = query.query;
      const products = await productService.getAllProducts(
        plimit,
        ppage,
        psort,
        pquery
      );
      let checkProds = JSON.stringify(products);
      logger.debug(`getProducts line 22 checkProds: ${checkProds}`);
      logger.debug(
        `getProducts line 25 req.session.user: ${JSON.stringify(
          req.session.user
        )}`
      );
      return res.render('products', {
        status: 'success',
        //payload: products.docs.map((product) => ({
        payload: products.map((product) => ({
          //id: product._id,
          id: product.id,
          title: product.title,
          description: product.description,
          code: product.code,
          price: product.price,
          stock: product.stock,
          category: product.category,
          status: product.status,
          owner: product.owner,
        })),
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        //prevLink: Link directo a la página previa (null si hasPrevPage=false)
        //nextLink: Link directo a la página siguiente (null si hasNextPage=false)
        totalDocs: products.totalDocs,
        limit: products.limit,
        pagingCounter: products.pagingCounter,
        profile: req.session.user,
      });
    } catch (e) {
      logger.error(`ProductController.getProducts: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'getProducts error',
        cause: 'Contact Development team',
        message: e,
        code: EErros.GET_PRODUCTS_ERROR,
      });
    }
  }

  async getProductById(req, res) {
    try {
      const pid = req.params.pid;
      const product = await productService.getProductById(pid);
      return res.status(200).json({
        status: 'success',
        msg: 'product list',
        data: product,
      });
    } catch (e) {
      logger.error(
        `ProductController.getProductById: ${JSON.stringify(e.cause)}`
      );
      CustomError.createError({
        name: 'Get Product by ID error',
        cause: 'Contact Development team',
        message: e,
        code: EErros.GET_PRODUCT_BY_ID_ERROR,
      });
    }
  }

  async postProduct(req, res) {
    try {
      const product = req.body;
      logger.debug(
        `postProduct line 85 productsOk: ${JSON.stringify(product)}`
      );
      const isPremiumUser = req.session.user.isPremium;
      const emailUser = req.session.user.email;
      const newProduct = await productService.createProduct(
        product,
        isPremiumUser,
        emailUser
      );
      return res.redirect(newProduct.redirect);
      // return res.status(200).json({
      //   status: 'success',
      //   msg: 'product created',
      //   data: newProduct,
      // });
    } catch (e) {
      logger.error(`ProductController.postProduct: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Create Product',
        cause: e.cause,
        message: e,
        code: EErros.CREATE_PRODUCT_ERROR,
      });
    }
  }

  async postManyProduct(req, res) {
    let errorEncontrado = false;
    let errorEncontradoMsg;
    try {
      const products = req.body;
      //const isPremiumUser = req.session.user.isPremium;
      //const emailUser = req.session.user.email;
      for (const product of products) {
        try {
          const newProduct = await productService.createProduct(
            product,
            false,
            ''
          );
        } catch (e) {
          throw e;
        }
      }
      return res.status(200).json({
        status: 'success MENTIRA!',
        msg: 'products created',
        data: 'check http://localhost:8080/api/products',
      });
    } catch (e) {
      logger.error(
        `ProductController.postManyProduct: ${JSON.stringify(e.cause)}`
      );
      CustomError.createError({
        name: 'Create Product',
        cause: e.cause,
        message: e,
        code: EErros.CREATE_PRODUCT_ERROR,
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const pid = req.params.pid;
      const product = req.body.product;
      const isAdminUser = req.session.user.isAdmin;
      const isPremiumUser = req.session.user.isPremium;
      const emailUser = req.session.user.email;
      logger.debug(
        `updateProduct line 102 product on req.body: ${JSON.stringify(
          product
        )} and pid: ${pid}`
      );
      //const rta = await store.updateProduct(pid, product);
      const updatedProduct = await productService.updateProduct(
        pid,
        product,
        isAdminUser,
        isPremiumUser,
        emailUser
      );
      return res.status(200).json({
        status: 'success',
        msg: 'product updated!',
        data: updatedProduct,
      });
    } catch (e) {
      if (e.code === EErros.PRODUCT_UPDATE_VALIDATION_ERROR) {
        throw e;
      } else {
        logger.error(
          `ProductController.updateProduct: ${JSON.stringify(e.cause)}`
        );
        CustomError.createError({
          name: 'Update Product error',
          cause: 'Contact Development team',
          message: e,
          code: EErros.UPDATE_PRODUCT_ERROR,
        });
      }
    }
  }

  async deleteProduct(req, res) {
    try {
      const pid = req.params.pid;
      const isAdminUser = req.session.user.isAdmin;
      const isPremiumUser = req.session.user.isPremium;
      const emailUser = req.session.user.email;
      //const rta = await store.deleteProduct(pid);
      const deletedProduct = await productService.deleteProduct(
        pid,
        isAdminUser,
        isPremiumUser,
        emailUser
      );
      return res.status(200).json({
        status: 'success',
        msg: 'product deleted!',
        data: deletedProduct,
      });
    } catch (e) {
      if (e.code === EErros.PRODUCT_DELETE_VALIDATION_ERROR) {
        throw e;
      } else {
        logger.error(
          `ProductController.deleteProduct: ${JSON.stringify(e.cause)}`
        );
        CustomError.createError({
          name: 'Delete product error',
          cause: 'Contact Development team',
          message: e,
          code: EErros.DELETE_PRODUCT_ERROR,
        });
      }
    }
  }

  createProductForm(_, res) {
    try {
      //1-extrae del request los datos
      //2-NO trabaja. pasa el problema al service.
      const createProd = productService.createProductForm();
      //3-Responde al usuario final
      return res
        .status(createProd.status)
        .render(createProd.render, createProd.msg);
    } catch (e) {
      logger.error(
        `ProductController.createProductForm: ${JSON.stringify(e.cause)}`
      );
      CustomError.createError({
        name: 'Create product into form error',
        cause: 'Contact Development team',
        message: e,
        code: EErros.CRETE_PRODUCT_FORM_ERROR,
      });
    }
  }
}

export const productController = new ProductController();
