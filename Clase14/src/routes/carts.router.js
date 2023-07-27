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

routerCarts.get('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const productsCart = await cartService.getProductsByCartId(cid);
    // return res.status(200).json({
    //   status: 'success',
    //   msg: 'Products cart',
    //   data: productsCart,
    // });
    console.log(JSON.stringify(productsCart));
    res.render('cart-detail', {
      payload: productsCart.productsArray.map((product) => ({
        id: product.prodId._id,
        title: product.prodId.title,
        price: product.prodId.price,
        quantity: product.quantity,
      })),
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

//cart creation (empty of products)
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

//PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
routerCarts.put('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const prodsArray = req.body.prodsArray;
    const updateProdsOnCart = await cartService.updateProdsOnCart(
      cid,
      prodsArray
    );
    return res.status(200).json({
      status: 'success',
      msg: 'products array updated on cart',
      data: updateProdsOnCart,
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

//PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
routerCarts.put('/:cid/products/:pid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const prodQuantity = req.body.quantity;
    const updatedCart = await cartService.updateProdQtyOnCart(
      cid,
      pid,
      prodQuantity
    );
    return res.status(200).json({
      status: 'success',
      msg: 'product updated on cart',
      data: updatedCart,
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

//DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.
routerCarts.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const deleteProdFromCart = await cartService.deleteProd(cid, pid);
    return res.status(200).json({
      status: 'success',
      msg: 'product deleted from cart',
      data: deleteProdFromCart,
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

//DELETE api/carts/:cid deberá eliminar todos los productos del carrito
routerCarts.delete('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const deleteAllProds = await cartService.deleteAllProds(cid);
    return res.status(200).json({
      status: 'success',
      msg: 'All products deleted from cart',
      data: deleteAllProds,
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
