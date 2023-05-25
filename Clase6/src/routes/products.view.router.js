import { Router } from 'express';
import { ProductManager } from '../ProductManager.js';
const store = new ProductManager();

export const routerViewProducts = Router();

routerViewProducts.get('/', async (req, res) => {
  const rta = await store.getProducts();
  return res.render('home', {
    products: rta.details,
  });
});
