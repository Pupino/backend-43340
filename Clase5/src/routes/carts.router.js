import { Router } from 'express';
import { CartManager } from '../CartManager.js';
const sales = new CartManager();

export const routerCarts = Router();

routerCarts.post('/', async (req, res) => {
  const rta = await sales.addCart();
  return res
    .status(rta.code)
    .json({ status: rta.status, details: rta.details });
});

routerCarts.post('/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const rta = await sales.updateCart(cid, pid);
  return res
    .status(rta.code)
    .json({ status: rta.status, details: rta.details });
});

routerCarts.get('/:cid', async (req, res) => {
  const cid = req.params.cid;
  const rta = await sales.getProductsByCartId(cid);
  return res
    .status(rta.code)
    .json({ status: rta.status, details: rta.details });
});
