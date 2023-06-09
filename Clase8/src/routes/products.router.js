import { Router } from 'express';
import { productService } from '../services/products.service.js';

export const routerProducts = Router();

routerProducts.get('/', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    const checkProds = JSON.stringify(products);
    console.log('checkProds: ' + checkProds);
    return res.render('home', {
      products: products,
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
