import express from 'express';
import { ProductManager } from '../ProductManager.js';
const store = new ProductManager();

export const routerViewRealTimeProducts = express.Router();

routerViewRealTimeProducts.get('/', async (req, res) => {
  const rta = await store.getProducts();
  return res.render('real-time-products', {
    products: rta.details,
  });
});
