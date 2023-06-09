//@ts-check
import { CartModel } from '../DAO/models/carts.model.js';
class CartService {
  async getAllCarts() {
    const allCarts = await CartModel.find();
    return allCarts;
  }

  async addCart() {
    const cartCreated = await CartModel.create([{ prodId: '', quantity: '' }]);
    return cartCreated;
  }

  async updateCart(cartId, prodId) {
    //update entire product object based on id by parameter
    //find cart object by id
    console.log(`cartId: ${cartId} and prodId: ${prodId}`);
    const cartUpdated = await CartModel.updateOne(
      { _id: cartId },
      { $set: { miArray: { prodId: prodId, quantity: 1 } } }
    );
    return cartUpdated;
  }

  async getProductsByCartId(id) {
    //returns products array belong to cart id
    const products = await CartModel.findById(id);
    return products;
  }
}

export const cartService = new CartService();
