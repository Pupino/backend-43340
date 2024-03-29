import { Router } from 'express';
import { isUser, isAdmin, isPremiumOrAdmin } from '../middlewares/auth.js';
import { productController } from '../controllers/products.controller.js';
import { generateProduct } from '../utils/generateData.js';
import CustomError from '../services/errors/custom-error.js';
import EErros from '../services/errors/enum.js';
import { logger } from '../Utils/logger.js';
export const productsRouter = Router();
//Ejemplo: http://localhost:8080/api/products/?page=1&limit=5&sort=asc&query=PAQ
productsRouter.get('/', isUser, productController.getProducts);
productsRouter.get('/create', productController.createProductForm);

productsRouter.post('/', isPremiumOrAdmin, productController.postProduct);
productsRouter.put('/:pid', productController.updateProduct); //ROMINA: ofrecer una vista desde donde llamar a la api al momento de hacer submit de UPDATE
productsRouter.delete('/:pid', productController.deleteProduct); //ROMINA: ofrecer una vista desde donde llamar a la api al momento de hacer submit de DELETE

productsRouter.get('/mockingproducts', async (req, res) => {
  try {
    const products = [];
    for (let i = 0; i < 100; i++) {
      products.push(generateProduct());
    }
    const user = '';
    res.send({ status: 'success', payload: products });
  } catch (e) {
    CustomError.createError({
      name: 'Mocking creation error',
      cause: 'Contact Development team',
      message: e,
      code: EErros.FAKER_ERROR,
    });
  }
});

//:pid
//receives a product id by req.params and returns the product if exists
productsRouter.get('/:pid', productController.getProductById);
