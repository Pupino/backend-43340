import express from 'express';
//import { ProductManager } from '../DAO/ProductManager.js';
//const store = new ProductManager();
import { productService } from '../services/products.service.js';
import { logger } from '../Utils/logger.js';

export const routerViewRealTimeProducts = express.Router();

routerViewRealTimeProducts.get('/', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    return res.render('real-time-products', {
      products: products,
    });
  } catch (e) {
    logger.error(`routerViewRealTimeProducts error: ${e}`);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});
