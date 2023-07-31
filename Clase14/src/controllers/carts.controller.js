//@ts-check
import { cartService } from '../services/carts.service.js';
class CartsController {
  async getAll(req, res) {
    //1-extrae del request los datos
    try {
      //2-NO trabaja. pasa el problema al service.
      const carts = await cartService.getAllCarts();
      const cartsString = JSON.stringify(carts);
      console.log('cartsString: ' + cartsString);
      //3-Responde al usuario final
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
  }

  async getById(req, res) {
    try {
      const cid = req.params.cid;
      const productsCart = await cartService.getProductsByCartId(cid);
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
  }

  async createEmptyCart(_, res) {
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
  }

  async updateProdcuctsCart(req, res) {
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
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
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
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
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
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      });
    }
  }
}

export const cartsController = new CartsController();
