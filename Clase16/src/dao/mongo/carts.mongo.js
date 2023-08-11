//@ts-check
import { CartModel } from './models/carts.model.js';
import mongoose from 'mongoose';

export default class Carts {
  constructor() {}
  async getAllCarts() {
    try {
      const allCarts = await CartModel.find().populate('productsArray.prodId');
      return allCarts;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async getCartByUserId(uid) {
    try {
      const cart = await CartModel.find({ userId: uid });
      return cart;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async addCart(uid) {
    try {
      const cartCreated = await CartModel.create({
        userId: uid,
        //productsArray: [{ prodId: null, quantity: '' }],
      });
      return cartCreated;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async getProductsByCartId(id) {
    //returns products array belong to cart id
    try {
      console.log('cart id: ' + id);
      const products = await CartModel.findById(id).populate(
        'productsArray.prodId'
      );
      console.log('line 20: ' + JSON.stringify(products));
      return products;
    } catch (e) {
      console.error(e);
      return e;
    }
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
      `DAO mongo cartId: ${cid} and prodId: ${pid} and prodQuantity: ${prodQuantity}`
    );
    const objectId = new mongoose.Types.ObjectId(cid);
    console.log(`objectId: ${objectId}`);
    //const cartUpdated = await CartModel.updateOne(
    const cartUpdated = await CartModel.updateOne(
      {
        _id: cid,
        'productsArray.prodId': pid,
      },
      { $set: { 'productsArray.$.quantity': prodQuantity } }
    );
    return cartUpdated;
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

//export const cartsModel = new Carts();
