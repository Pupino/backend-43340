//@ts-check
import { cartService } from '../services/carts.service.js';
import { productService } from '../services/products.service.js';
import CartDTO from '../dao/DTO/cart.dto.js';
import { ticketService } from '../services/tickets.service.js';
import CustomError from '../services/errors/custom-error.js';
import EErros from '../services/errors/enum.js';
//import ProductDTO from '../dao/DTO/product.dto.js';

class CartsController {
  async getAll(req, res) {
    //1-extrae del request los datos
    try {
      //2-NO trabaja. pasa el problema al service.
      const carts = await cartService.getAllCarts();
      const cartsString = JSON.stringify(carts);
      //console.log('cartsString: ' + cartsString);
      //3-Responde al usuario final
      return res.status(200).json({
        status: 'success',
        msg: 'carts list',
        data: carts,
      });
    } catch (e) {
      CustomError.createError({
        name: 'Get all carts error',
        cause: 'Contact Development team',
        message: 'Error trying to get all carts',
        code: EErros.GET_ALL_CARTS_ERROR,
      });
    }
  }

  async getById(req, res) {
    try {
      const cid = req.params.cid;
      //console.log('cid: ' + cid);
      const productsCart = await cartService.getProductsByCartId(cid);
      //console.log(JSON.stringify(productsCart));
      res.render('cart-detail', {
        payload: productsCart.productsArray.map((product) => ({
          id: product.prodId._id,
          title: product.prodId.title,
          price: product.prodId.price,
          quantity: product.quantity,
        })),
      });
    } catch (e) {
      CustomError.createError({
        name: 'Get cart by id error',
        cause: 'Contact Development team',
        message: 'Error trying to get a cart by id',
        code: EErros.GET_CART_BY_ID_ERROR,
      });
    }
  }

  async createEmptyCart(req, res) {
    try {
      //console.log(`El req.session es: ${JSON.stringify(req.session)}`);
      //let cartId = req.session.user.cartId;
      //console.log(`El cartId es: ${cartId}`);
      // if (cartId === null || cartId === undefined) {
      //   console.log(
      //     'La cartId está vacía o es nula/undefined. Crear un cart y asociarlo al usuario'
      //   );
      //   const uid = req.params.uid;
      //   const cart = await cartService.addCart(uid);
      //   console.log(`El cart creado es: ${cart}`);
      //   cartId = cart;
      // }
      // const uid = req.params.uid;
      const uid = req.session.user._id;
      //primero validar que no exista uno creado, si existe no hace falta crearlo
      let cart = await cartService.getCartByUserId(uid);
      //console.log(typeof cart);
      //console.log(`cartExist ${cart}`);
      if (typeof cart === 'object' && Object.keys(cart).length === 0) {
        //si el cart vuelve vacio es q no tiene uno el usuario, hay q crearselo
        const newCart = await cartService.addCart(uid);
        cart.push(newCart);
      }
      //console.log(`cart DTO: ${JSON.stringify(cart)}`);
      cart = new CartDTO(cart);
      //console.log('cart after DTO: ' + JSON.stringify(cart));
      return res.status(200).json({
        status: 'success',
        msg: 'cart created',
        data: cart,
      });
    } catch (e) {
      CustomError.createError({
        name: 'Create empty cart error',
        cause: 'Contact Development team',
        message: 'Error trying to create an empty cart',
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
      CustomError.createError({
        name: 'Update products on cart error',
        cause: 'Contact Development team',
        message: 'Error trying update products on cart',
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
      CustomError.createError({
        name: 'Update product quantity on cart error',
        cause: 'Contact Development team',
        message: 'Error trying update product quantity on cart',
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
      CustomError.createError({
        name: 'Remove product from cart error',
        cause: 'Contact Development team',
        message: 'Error trying to remove product from cart',
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
      CustomError.createError({
        name: 'Removing all products from cart error',
        cause: 'Contact Development team',
        message: 'Error trying to remove all products from cart',
        code: EErros.REMOVE_ALL_PROD_CART_ERROR,
      });
    }
  }

  async purchase(req, res) {
    try {
      //console.log('req: ' + JSON.stringify(req.user));
      const cid = req.params.cid; //tengo el carrito
      //obtener los productos del carrito e ir iterando para chequear el stock consultando el productService
      const productsCart = await cartService.getProductsByCartId(cid);
      //console.log(`productsCart: ${JSON.stringify(productsCart)}`);
      //1a) check products stock: si el producto tiene la cantidad indicada en stock, descontar del stock y que continué el producto en el proceso de compra
      //1b) check products stock: si el producto NO tiene la cantidad indicada en stock, no agregar el producto en el proceso de compra
      let productsOk = [];
      let productsNoStock = [];
      let totalAmount = 0;
      for (const product of productsCart.productsArray) {
        //I need to use for instead of foreach because await works in that way
        //console.log(`product: ${JSON.stringify(product)}`);
        //console.log(
        //`product.prodId._id: ${JSON.stringify(product.prodId._id)}`
        //);
        //console.log(`product.quantity: ${JSON.stringify(product.quantity)}`);
        //con estos 2 datos extraidos ir a chequear a los productos si tienen stock
        let productInfo = await productService.getProductById(
          product.prodId._id
        );
        //console.log(`productInfo: ${JSON.stringify(productInfo)}`);
        if (productInfo.stock >= product.quantity) {
          //tiene stock, descontarle la cantidad a comprar
          //console.log(
          //`productInfo.stock: ${JSON.stringify(productInfo.stock)}`
          //);
          productInfo.stock = productInfo.stock - product.quantity;
          //console.log(
          //`productInfo.stock descontado: ${JSON.stringify(productInfo.stock)}`
          //);
          //si tienen stock descontarselos y agregar el producto a un array que contenga todo lo q si tiene stock
          const productUpdated = await productService.updateProduct(
            product.prodId._id,
            productInfo
          );
          //console.log(
          //`productUpdated dsp de descontar stock: ${JSON.stringify(
          //productUpdated
          //)}`
          //);
          productsOk.push({
            prodId: product.prodId._id,
            //prodObjIdOnCart: product._id, //to be removed then from cart: productsCart._id
            quantity: product.quantity,
            unitPrice: productInfo.price,
            totalPrice: product.quantity * productInfo.price,
          });
          totalAmount += product.quantity * productInfo.price;
          //console.log(`totalAmount: ${totalAmount}`);
        } else {
          productsNoStock.push({
            prodId: product.prodId._id,
            quantity: product.quantity,
            actualStock: productInfo.stock,
          });
        }
      }
      //console.log(`productsOk: ${JSON.stringify(productsOk)}`);
      //console.log(`productsNoStock: ${JSON.stringify(productsNoStock)}`);
      //2) generar el ticket de compra con los productos que si se descontaron del stock
      if (productsOk && productsOk.length) {
        let purchaser;
        try {
          purchaser = req.user.email;
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
        //
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
      CustomError.createError({
        name: 'Purchasing cart error',
        cause: 'Contact Development team',
        message: 'Error trying to purchase cart',
        code: EErros.PURCHASE_CART_ERROR,
      });
    }
  }
}

export const cartsController = new CartsController();
