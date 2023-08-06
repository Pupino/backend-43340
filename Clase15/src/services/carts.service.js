//@ts-check
//import { CartModel } from '../dao/mongo/models/carts.model.js';
import { cartsModel } from '../dao/mongo/carts.mongo.js';
//import { cartsModel } from '../dao/memory/carts.memory.js';
import { CreationError } from '../errors.js';
import CartDTO from '../dao/DTO/cart.dto.js';

class CartService {
  async getAllCarts() {
    try {
      let allCarts = await cartsModel.getAllCarts();
      allCarts = allCarts.map((cart) => new CartDTO(cart));
      return allCarts;
    } catch (e) {
      console.error(e);
      throw new CreationError();
    }
  }

  async addCart() {
    const cartCreated = await cartsModel.addCart();
    return cartCreated;
  }

  async getProductsByCartId(id) {
    //returns products array belong to cart id
    console.log('cart id: ' + id);
    const products = await cartsModel.getProductsByCartId(id);
    console.log('line 20: ' + JSON.stringify(products));
    return products;
  }

  async updateProdsOnCart(cid, prodsArray) {
    console.log(`cid: ${cid}, prodsArray: ${prodsArray}`);
    const prodsUpdated = await cartsModel.updateProdsOnCart(cid, prodsArray);
    /*let prods = await CartModel.find({ _id: cid }).populate(
      'productsArray.prodId'
    );
    console.log(JSON.stringify(prods, null, '\t'));*/
    return prodsUpdated;
  }

  async updateProdQtyOnCart(cid, pid, prodQuantity) {
    console.log(
      `cartId: ${cid} and prodId: ${pid} and prodQuantity: ${prodQuantity}`
    );
    const cartUpdated = await cartsModel.updateProdQtyOnCart(
      cid,
      pid,
      prodQuantity
    );
  }

  async deleteProd(cid, pid) {
    //delete entire product object based on pid by parameter
    //find cart object by cid
    console.log(`cartId: ${cid} and prodId: ${pid}`);
    const cartUpdated = await cartsModel.deleteProd(cid, pid);
    return cartUpdated;
  }

  async deleteAllProds(cid) {
    console.log(`cartId: ${cid}`);
    const cartReseted = await cartsModel.deleteAllProds(cid);
    return cartReseted;
  }
}

export const cartService = new CartService();
