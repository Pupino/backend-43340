import { Router } from 'express';
import { ProductManager } from '../ProductManager.js';
const store = new ProductManager();

export const routerProducts = Router();

//queryparam receives results limit ?limit=
//example: /products/?limit=2
//if not ?limit= is comming retrieves everything
routerProducts.get('/', async (req, res) => {
  const limit = req.query.limit;
  const rta = await store.getProducts(limit);
  return res.status(rta.code).json({
    status: rta.status,
    details: rta.details,
  });
});

//:pid
//receives a product id by req.params and returns the product if exists
routerProducts.get('/:pid', async (req, res) => {
  const pid = req.params.pid;
  const rta = await store.getProductById(pid);
  return res.status(rta.code).json({
    status: rta.status,
    details: rta.details,
  });
});

routerProducts.post('/', async (req, res) => {
  const product = req.body.product;
  console.log(JSON.stringify(product));
  const rta = await store.addProduct(product);
  return res
    .status(rta.code)
    .json({ status: rta.status, details: rta.details });
});

routerProducts.put('/:pid', async (req, res) => {
  const pid = req.params.pid;
  const product = req.body.product;
  console.log(JSON.stringify(product));
  const rta = await store.updateProduct(pid, product);
  return res
    .status(rta.code)
    .json({ status: rta.status, details: rta.details });
});

routerProducts.delete('/:pid', async (req, res) => {
  const pid = req.params.pid;
  const rta = await store.deleteProduct(pid);
  return res.status(rta.code).json({
    status: rta.status,
    details: rta.details,
  });
});
