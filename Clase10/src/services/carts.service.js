//@ts-check
import { CartModel } from '../DAO/models/carts.model.js';
class CartService {
  async getAllCarts() {
    const allCarts = await CartModel.find().populate('productsArray.prodId');
    return allCarts;
  }

  async addCart() {
    const cartCreated = await CartModel.create([{ prodId: '', quantity: '' }]);
    return cartCreated;
  }

  async getProductsByCartId(id) {
    //returns products array belong to cart id
    const products = await CartModel.findById(id).populate(
      'productsArray.prodId'
    );
    return products;
  }

  async updateProdsOnCart(cid, prodsArray) {
    console.log(`cid: ${cid}, prodsArray: ${prodsArray}`);
    const prodsUpdated = await CartModel.updateOne(
      { _id: cid },
      { $set: { productsArray: prodsArray } }
    );
    let prods = await CartModel.find({ _id: cid }).populate(
      'productsArray.prodId'
    );
    console.log(JSON.stringify(prods, null, '\t'));
    return prodsUpdated;
  }

  async updateProdQtyOnCart(cid, pid, prodQuantity) {
    console.log(
      `cartId: ${cid} and prodId: ${pid} and prodQuantity: ${prodQuantity}`
    );
    const cartUpdated = await CartModel.updateOne(
      {
        _id: cid,
        'productsArray.prodId': pid,
      },
      { $set: { 'productsArray.$.quantity': prodQuantity } }
    );
  }

  async deleteProd(cid, pid) {
    //delete entire product object based on pid by parameter
    //find cart object by cid
    console.log(`cartId: ${cid} and prodId: ${pid}`);
    const cartUpdated = await CartModel.updateOne(
      { _id: cid },
      { $pull: { productsArray: { prodId: pid } } }
    );
    return cartUpdated;
  }

  async deleteAllProds(cid) {
    console.log(`cartId: ${cid}`);
    const cartReseted = await CartModel.updateOne(
      { _id: cid },
      { $unset: { productsArray: '' } }
    );
    return cartReseted;
  }
}

export const cartService = new CartService();
