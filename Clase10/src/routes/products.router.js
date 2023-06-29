import { Router } from 'express';
import { productService } from '../services/products.service.js';
import { checkUser } from '../middlewares/auth.js';

export const routerProducts = Router();
//Ejemplo: http://localhost:8080/api/products/?page=1&limit=5&sort=asc&query=PAQ
routerProducts.get('/', checkUser, async (req, res) => {
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
    return res.render('products', {
      status: 'success',
      payload: products.docs.map((product) => ({
        id: product._id,
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
      profile: req.session,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});

//:pid
//receives a product id by req.params and returns the product if exists
routerProducts.get('/:pid', async (req, res) => {
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
});

routerProducts.post('/', async (req, res) => {
  try {
    const product = req.body.product;
    console.log('post product: ' + JSON.stringify(product));
    const newProduct = await productService.createProduct(product);
    return res.status(200).json({
      status: 'success',
      msg: 'product created',
      data: newProduct,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});

routerProducts.put('/:pid', async (req, res) => {
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
});

routerProducts.delete('/:pid', async (req, res) => {
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
});
