import { Router } from 'express';
import { cartsController } from '../controllers/carts.controller.js';

export const routerCarts = Router();

routerCarts.get('/', cartsController.getAll);
routerCarts.get('/:cid', cartsController.getById);

//cart creation (empty of products)
routerCarts.post('/', cartsController.createEmptyCart);

//PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
routerCarts.put('/:cid', cartsController.updateProdcuctsCart);

//PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
routerCarts.put('/:cid/products/:pid', cartsController.updateProdQtyOnCart);

//DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.
routerCarts.delete('/:cid/products/:pid', cartsController.removeProdFromCart);

//DELETE api/carts/:cid deberá eliminar todos los productos del carrito
routerCarts.delete('/:cid', cartsController.cleanCart);
