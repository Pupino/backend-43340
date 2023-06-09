import { Router } from 'express';
import { cartService } from '../services/carts.service.js';

export const routerCarts = Router();

routerCarts.get('/', async (req, res) => {
  try {
    const carts = await cartService.getAllCarts();
    const cartsString = JSON.stringify(carts);
    console.log('cartsString: ' + cartsString);
    return res.status(200).json({
      status: 'success',
      msg: 'carts list',
      data: carts,
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

routerCarts.post('/', async (req, res) => {
  try {
    const cart = await cartService.addCart();
    return res.status(200).json({
      status: 'success',
      msg: 'cart created',
      data: cart,
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

routerCarts.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const updateCart = await cartService.updateCart(cid, pid);
    return res.status(200).json({
      status: 'success',
      msg: 'cart updated',
      data: updateCart,
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

routerCarts.get('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const productsCart = await cartService.getProductsByCartId(cid);
    return res.status(200).json({
      status: 'success',
      msg: 'Products cart',
      data: productsCart,
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
