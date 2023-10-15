//@ts-check
import { cartService } from '../services/carts.service.js';
import { productService } from '../services/products.service.js';
import CartDTO from '../dao/DTO/cart.dto.js';
import { ticketService } from '../services/tickets.service.js';
import CustomError from '../services/errors/custom-error.js';
import EErros from '../services/errors/enum.js';
import { logger } from '../Utils/logger.js';
//import ProductDTO from '../dao/DTO/product.dto.js';

class CartsController {
  async getAll(req, res) {
    //1-extrae del request los datos
    try {
      //2-NO trabaja. pasa el problema al service.
      logger.debug(`getAll line 16`);
      const carts = await cartService.getAllCarts();
      const cartsString = JSON.stringify(carts);
      logger.debug(`getAll line 17 cartsString: ${cartsString}`);
      //3-Responde al usuario final
      return res.status(200).json({
        status: 'success',
        msg: 'carts list',
        data: carts,
      });
    } catch (e) {
      logger.error(`CartsController.getAll: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Get all carts error',
        cause: 'Contact Development team',
        message: e,
        code: EErros.GET_ALL_CARTS_ERROR,
      });
    }
  }

  async getById(req, res) {
    try {
      const cid = req.params.cid;
      logger.debug(`getById line 37 cid: ${cid}`);
      const productsCart = await cartService.getProductsByCartId(cid);
      logger.debug(
        `getById line 39 productsCart: ${JSON.stringify(productsCart)}`
      );
      res.render('cart-detail', {
        payload: productsCart.productsArray.map((product) => ({
          id: product.prodId._id,
          title: product.prodId.title,
          price: product.prodId.price,
          quantity: product.quantity,
        })),
        cartId: cid,
      });
    } catch (e) {
      logger.error(`CartsController.getById: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Get cart by id error',
        cause: 'Contact Development team',
        message: e,
        code: EErros.GET_CART_BY_ID_ERROR,
      });
    }
  }

  async createEmptyCart(req, res) {
    try {
      logger.debug(`req.session.user line 64: ${req.session.user}`);
      const uid = req.session.user._id;
      logger.debug(`uid line 65: cartExist ${uid}`);
      //primero validar que no exista uno creado, si existe no hace falta crearlo
      let cart = await cartService.getCartByUserId(uid);
      logger.debug(`createEmptyCart line 66: cartExist ${cart}`);
      if (typeof cart === 'object' && Object.keys(cart).length === 0) {
        //si el cart vuelve vacio es q no tiene uno el usuario, hay q crearselo
        const newCart = await cartService.addCart(uid);
        cart.push(newCart);
      }
      logger.debug(
        `createEmptyCart line 71 cart DTO: ${JSON.stringify(cart[0])}`
      );
      cart = new CartDTO(cart[0]);
      logger.debug(
        `createEmptyCart line 73 cart after DTO: ${JSON.stringify(cart)}`
      );
      return res.status(200).json({
        status: 'success',
        msg: 'cart created',
        data: cart,
      });
    } catch (e) {
      logger.error(
        `CartsController.createEmptyCart: ${JSON.stringify(e.cause)}`
      );
      CustomError.createError({
        name: 'Create empty cart error',
        cause: 'Contact Development team',
        message: e,
        code: EErros.CREATE_EMPTY_CART_ERROR,
      });
    }
  }

  async updateProductsCart(req, res) {
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
      logger.error(
        `CartsController.updateProductsCart: ${JSON.stringify(e.cause)}`
      );
      CustomError.createError({
        name: 'Update products on cart error',
        cause: 'Contact Development team',
        message: e,
        code: EErros.UPDATE_PRODUCTS_CART_ERROR,
      });
    }
  }

  async updateProdQtyOnCart(req, res) {
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
      logger.error(
        `CartsController.updateProdQtyOnCart: ${JSON.stringify(e.cause)}`
      );
      CustomError.createError({
        name: 'Update product quantity on cart error',
        cause: 'Contact Development team',
        message: e,
        code: EErros.UPDATE_PROD_QTY_CART_ERROR,
      });
    }
  }

  async removeProdFromCart(req, res) {
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
      logger.error(
        `CartsController.removeProdFromCart: ${JSON.stringify(e.cause)}`
      );
      CustomError.createError({
        name: 'Remove product from cart error',
        cause: 'Contact Development team',
        message: e,
        code: EErros.REMOVE_PROD_CART_ERROR,
      });
    }
  }

  async cleanCart(req, res) {
    try {
      const cid = req.params.cid;
      const deleteAllProds = await cartService.deleteAllProds(cid);
      return res.status(200).json({
        status: 'success',
        msg: 'All products deleted from cart',
        data: deleteAllProds,
      });
    } catch (e) {
      logger.error(`CartsController.cleanCart: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Removing all products from cart error',
        cause: 'Contact Development team',
        message: e,
        code: EErros.REMOVE_ALL_PROD_CART_ERROR,
      });
    }
  }

  async purchase(req, res) {
    try {
      logger.debug(`purchase line 183: req.user ${JSON.stringify(req.user)}`);
      const cid = req.params.cid; //tengo el carrito
      const isAdminUser = req.session.user.isAdmin;
      const isPremiumUser = req.session.user.isPremium;
      const emailUser = req.session.user.email;
      //obtener los productos del carrito e ir iterando para chequear el stock consultando el productService
      const productsCart = await cartService.getProductsByCartId(cid);
      logger.debug(
        `purchase line 189 productsCart: ${JSON.stringify(productsCart)}`
      );
      //1a) check products stock: si el producto tiene la cantidad indicada en stock, descontar del stock y que continué el producto en el proceso de compra
      //1b) check products stock: si el producto NO tiene la cantidad indicada en stock, no agregar el producto en el proceso de compra
      let productsOk = [];
      let productsNoStock = [];
      let totalAmount = 0;
      for (const product of productsCart.productsArray) {
        //I need to use for instead of foreach because await works in that way
        logger.debug(
          `purchase line 199 productsCart: ${JSON.stringify(product)}`
        );
        //con estos 2 datos extraidos ir a chequear a los productos si tienen stock
        let productInfo = await productService.getProductById(
          product.prodId._id
        );
        logger.debug(
          `purchase line 206 productsCart: ${JSON.stringify(productInfo)}`
        );
        if (productInfo.stock >= product.quantity) {
          //tiene stock, descontarle la cantidad a comprar
          logger.debug(
            `purchase line 211 productInfo.stock: ${JSON.stringify(
              productInfo.stock
            )}`
          );
          productInfo.stock = productInfo.stock - product.quantity;
          logger.debug(
            `purchase line 217 productInfo.stock descontado: ${JSON.stringify(
              productInfo.stock
            )}`
          );
          //si tienen stock descontarselos y agregar el producto a un array que contenga todo lo q si tiene stock
          const productUpdated = await productService.updateProduct(
            product.prodId._id,
            productInfo,
            isAdminUser,
            isPremiumUser,
            emailUser
          );
          logger.debug(
            `purchase line 227 productUpdated dsp de descontar stock : ${JSON.stringify(
              productUpdated
            )}`
          );
          productsOk.push({
            prodId: product.prodId._id,
            //prodObjIdOnCart: product._id, //to be removed then from cart: productsCart._id
            quantity: product.quantity,
            unitPrice: productInfo.price,
            totalPrice: product.quantity * productInfo.price,
          });
          totalAmount += product.quantity * productInfo.price;
          logger.debug(`purchase line 239 totalAmount: ${totalAmount}`);
        } else {
          productsNoStock.push({
            prodId: product.prodId._id,
            quantity: product.quantity,
            actualStock: productInfo.stock,
          });
        }
      }
      logger.debug(
        `purchase line 248 productsOk: ${JSON.stringify(productsOk)}`
      );
      logger.debug(
        `purchase line 249 productsNoStock: ${JSON.stringify(productsNoStock)}`
      );
      //2) generar el ticket de compra con los productos que si se descontaron del stock
      if (productsOk && productsOk.length) {
        let purchaser;
        try {
          purchaser = req.session.user.email; //req.user.email;
        } catch (error) {
          purchaser =
            'A user on Memory: need to solve how to retrieve since req.user.email is not working...';
        }
        let ticketObj = {
          amount: totalAmount,
          purchaser,
        };
        const ticketCreated = await ticketService.createTicket(ticketObj);
        //3) si hubieron productos sin stock, devolverlos en un array
        //devolver productsNoStock
        //4) una vez finalizada la compra, el carrito asociado al usuario solo debera contener los productos que no pudieron comprarse
        //descontar del carrito los productos que si se ticketearon
        for (const product of productsOk) {
          let deleteProdFromCart = await cartService.deleteProd(
            cid,
            product.prodId
          );
        }
        return res.status(200).json({
          status: 'success',
          msg: 'Products situation are:',
          products: { toBePurchased: productsOk, withNoStock: productsNoStock },
          ticket: ticketCreated,
        });
      } else {
        return res.status(200).json({
          status: 'success',
          msg: 'Products situation are:',
          products: { toBePurchased: productsOk, withNoStock: productsNoStock },
          ticket:
            'No ticket because No Stock available for any Product on Cart',
        });
      }
    } catch (e) {
      logger.error(`CartsController.purchase: ${JSON.stringify(e.cause)}`);
      CustomError.createError({
        name: 'Purchasing cart error',
        cause: 'Contact Development team',
        message: e,
        code: EErros.PURCHASE_CART_ERROR,
      });
    }
  }
}

export const cartsController = new CartsController();
