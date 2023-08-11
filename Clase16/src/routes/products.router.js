import { Router } from 'express';
import { isUser, isAdmin } from '../middlewares/auth.js';
import { productController } from '../controllers/products.controller.js';

export const routerProducts = Router();
//Ejemplo: http://localhost:8080/api/products/?page=1&limit=5&sort=asc&query=PAQ
routerProducts.get('/', isUser, productController.getProducts);
routerProducts.get('/create', productController.createProductForm);

//:pid
//receives a product id by req.params and returns the product if exists
routerProducts.get('/:pid', productController.getProductById);

routerProducts.post('/', isAdmin, productController.postProduct);
routerProducts.put('/:pid', isAdmin, productController.updateProduct); //ROMINA: ofrecer una vista desde donde llamar a la api al momento de hacer submit de UPDATE
routerProducts.delete('/:pid', isAdmin, productController.deleteProduct); //ROMINA: ofrecer una vista desde donde llamar a la api al momento de hacer submit de DELETE
