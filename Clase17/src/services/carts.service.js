//@ts-check
import { cartsModel } from '../dao/factory.js';
import CartDTO from '../dao/DTO/cart.dto.js';

class CartService {
  async getAllCarts() {
    try {
      let allCarts = await cartsModel.getAllCarts();
      allCarts = allCarts.map((cart) => new CartDTO(cart));
      return allCarts;
    } catch (e) {
      throw e;
    }
  }

  async getCartByUserId(userId) {
    try {
      let cart = await cartsModel.getCartByUserId(userId);
      //console.log(`Cart about uid ${userId} is ${JSON.stringify(cart)}`);
      return cart;
    } catch (e) {
      throw e;
    }
  }

  async addCart(userId) {
    try {
      const cartCreated = await cartsModel.addCart(userId);
      return cartCreated;
    } catch (e) {
      throw e;
    }
  }

  async getProductsByCartId(id) {
    try {
      //returns products array belong to cart id
      //console.log('cart id: ' + id);
      const products = await cartsModel.getProductsByCartId(id);
      //console.log('line 20: ' + JSON.stringify(products));
      return products;
    } catch (e) {
      throw e;
    }
  }

  async updateProdsOnCart(cid, prodsArray) {
    try {
      //console.log(`cid: ${cid}, prodsArray: ${prodsArray}`);
      const prodsUpdated = await cartsModel.updateProdsOnCart(cid, prodsArray);
      /*let prods = await CartModel.find({ _id: cid }).populate(
      'productsArray.prodId'
    );
    console.log(JSON.stringify(prods, null, '\t'));*/
      return prodsUpdated;
    } catch (e) {
      throw e;
    }
  }

  async updateProdQtyOnCart(cid, pid, prodQuantity) {
    try {
      // console.log(
      //   `cartId: ${cid} and prodId: ${pid} and prodQuantity: ${prodQuantity}`
      // );
      const cartUpdated = await cartsModel.updateProdQtyOnCart(
        cid,
        pid,
        prodQuantity
      );
      return cartUpdated;
    } catch (e) {
      throw e;
    }
  }

  async deleteProd(cid, pid) {
    try {
      //delete entire product object based on pid by parameter
      //find cart object by cid
      //console.log(`cartId: ${cid} and prodId: ${pid}`);
      const cartUpdated = await cartsModel.deleteProd(cid, pid);
      return cartUpdated;
    } catch (e) {
      throw e;
    }
  }

  async deleteAllProds(cid) {
    try {
      //console.log(`cartId: ${cid}`);
      const cartReseted = await cartsModel.deleteAllProds(cid);
      return cartReseted;
    } catch (e) {
      throw e;
    }
  }
}

export const cartService = new CartService();
