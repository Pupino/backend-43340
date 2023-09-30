import { Router } from 'express';
import { cartsController } from '../controllers/carts.controller.js';
import { isUser } from '../middlewares/auth.js';

export const routerCarts = Router();

routerCarts.get('/', cartsController.getAll);
routerCarts.get('/:cid', cartsController.getById);
routerCarts.post('/', cartsController.createEmptyCart);
routerCarts.put('/:cid', isUser, cartsController.updateProductsCart);

//PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
routerCarts.put('/:cid/products/:pid', cartsController.updateProdQtyOnCart);

//DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.
routerCarts.delete('/:cid/products/:pid', cartsController.removeProdFromCart);

//DELETE api/carts/:cid deberá eliminar todos los productos del carrito
routerCarts.delete('/:cid', cartsController.cleanCart);

//POST /:cid/purchase permite finalizar la compra de un carrito
routerCarts.post('/:cid/purchase', cartsController.purchase);
