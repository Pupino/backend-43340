import { Router } from 'express';
import { isUser } from '../middlewares/auth.js';
import { productController } from '../controllers/products.controller.js';

export const routerProducts = Router();
//Ejemplo: http://localhost:8080/api/products/?page=1&limit=5&sort=asc&query=PAQ
routerProducts.get('/', isUser, productController.getProducts);

//:pid
//receives a product id by req.params and returns the product if exists
routerProducts.get('/:pid', productController.getProductById);

routerProducts.post('/', productController.postProduct);
routerProducts.put('/:pid', productController.updateProduct);
routerProducts.delete('/:pid', productController.deleteProduct);
