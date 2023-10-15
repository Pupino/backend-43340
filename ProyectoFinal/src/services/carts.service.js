//@ts-check
import { cartsModel } from '../dao/factory.js';
import CartDTO from '../dao/DTO/cart.dto.js';
import { logger } from '../Utils/logger.js';

class CartService {
  async getAllCarts() {
    try {
      logger.debug(`getAllCarts line 8`);
      let allCarts = await cartsModel.getAllCarts();
      logger.debug(`getAllCarts line 10: ${JSON.stringify(allCarts)}`);
      allCarts = allCarts.map((cart) => new CartDTO(cart));
      return allCarts;
    } catch (e) {
      throw e;
    }
  }

  async getCartByUserId(userId) {
    try {
      let cart = await cartsModel.getCartByUserId(userId);
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
      const products = await cartsModel.getProductsByCartId(id);
      return products;
    } catch (e) {
      throw e;
    }
  }

  async updateProdsOnCart(cid, prodsArray) {
    try {
      const prodsUpdated = await cartsModel.updateProdsOnCart(cid, prodsArray);
      /*let prods = await CartModel.find({ _id: cid }).populate(
      'productsArray.prodId'
      );*/
      return prodsUpdated;
    } catch (e) {
      throw e;
    }
  }

  async updateProdQtyOnCart(cid, pid, prodQuantity) {
    try {
      const cartUpdated = await cartsModel.updateProdCart(
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
      const cartUpdated = await cartsModel.deleteProd(cid, pid);
      return cartUpdated;
    } catch (e) {
      throw e;
    }
  }

  async deleteAllProds(cid) {
    try {
      const cartReseted = await cartsModel.deleteAllProds(cid);
      return cartReseted;
    } catch (e) {
      throw e;
    }
  }
}

export const cartService = new CartService();
