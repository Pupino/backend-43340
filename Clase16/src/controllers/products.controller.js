//@ts-check
import { ConnectionError, ValidationError } from '../errors.js';
import { productService } from '../services/products.service.js';

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
      console.log('checkProds: ' + checkProds);
      console.log('req.session.user: ', req.session.user);
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
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
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
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      });
    }
  }

  async postProduct(req, res) {
    try {
      const product = req.body;
      const newProduct = await productService.createProduct(product);
      return res.status(200).json({
        status: 'success',
        msg: 'product created',
        data: newProduct,
      });
    } catch (e) {
      if (e instanceof ValidationError) {
        return res.status(500).json({
          status: 'error',
          msg: 'something went wrong =(',
          data: {
            exception: 'ValidationError',
            error: e,
          },
        });
      } else {
        return res.status(500).json({
          status: 'error',
          msg: 'something went wrong :(',
          data: { error: e },
        });
      }
    }
  }

  async updateProduct(req, res) {
    try {
      const pid = req.params.pid;
      const product = req.body.product;
      console.log(JSON.stringify(product));
      //const rta = await store.updateProduct(pid, product);
      const updatedProduct = await productService.updateProduct(pid, product);
      return res.status(200).json({
        status: 'success',
        msg: 'product updated!',
        data: updatedProduct,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const pid = req.params.pid;
      //const rta = await store.deleteProduct(pid);
      const deletedProduct = await productService.deleteProduct(pid);
      return res.status(200).json({
        status: 'success',
        msg: 'product deleted!',
        data: deletedProduct,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      });
    }
  }

  createProductForm(_, res) {
    //1-extrae del request los datos
    //2-NO trabaja. pasa el problema al service.
    const createProd = productService.createProductForm();
    //3-Responde al usuario final
    return res
      .status(createProd.status)
      .render(createProd.render, createProd.msg);
  }
}

export const productController = new ProductController();
