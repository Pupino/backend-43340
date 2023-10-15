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
      return e;
    }
  }

  async getCartByUserId(uid) {
    try {
      const cart = await CartModel.find({ userId: uid });
      return cart;
    } catch (e) {
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
      return e;
    }
  }

  async getProductsByCartId(id) {
    //returns products array belong to cart id
    try {
      const products = await CartModel.findById(id).populate(
        'productsArray.prodId'
      );
      return products;
    } catch (e) {
      return e;
    }
  }

  async updateProdsOnCart(cid, prodsArray) {
    const prodsUpdated = await CartModel.updateOne(
      { _id: cid },
      { $set: { productsArray: prodsArray } }
    );
    let prods = await CartModel.find({ _id: cid }).populate(
      'productsArray.prodId'
    );
    return prodsUpdated;
  }

  async updateProdQtyOnCart(cid, pid, prodQuantity) {
    //este metodo sirve cuando se tiene la certeza que el producto exite en el carrito
    const objectId = new mongoose.Types.ObjectId(cid);
    const cartUpdated = await CartModel.updateOne(
      {
        _id: cid,
        'productsArray.prodId': pid,
      },
      { $set: { 'productsArray.$.quantity': prodQuantity } }
    );
    return cartUpdated;
  }

  async updateProdCart(cid, pid, prodQuantity) {
    // Busca en el cart dentro del array de productos, si ya existe el producto
    const productFound = await CartModel.findOne({
      _id: cid,
      productsArray: { $elemMatch: { prodId: pid } },
    });

    if (productFound) {
      // Si existe, busca que cantidad ya tiene setteada, para sumarle la que viene por parametro
      const product = productFound.productsArray.find(
        (elem) => elem.prodId == pid
      );
      // Obtiene el valor de la propiedad deseada
      const actualQuantity = product.quantity;
      //al valor acutal le añade la recibida por parámetro
      const quantity = actualQuantity + prodQuantity;
      // Encuentra el elemento en el array que cumple con el criterio
      const cartProdUpdated = await this.updateProdQtyOnCart(
        cid,
        pid,
        quantity
      );
      return cartProdUpdated;
    } else {
      //hay que agregar el producto al array de productos del cart id
      const documento = await CartModel.findById(cid);
      // Crea un nuevo elemento
      const nuevoElemento = {
        prodId: pid,
        quantity: prodQuantity,
        // Agrega otras propiedades según tu estructura de datos
      };

      // Agrega el nuevo elemento al array
      documento.productsArray.push(nuevoElemento);

      // Guarda el documento actualizado en la base de datos
      const productAdded = await documento.save();
      return productAdded;
    }
  }

  async deleteProd(cid, pid) {
    //delete entire product object based on pid by parameter
    //find cart object by cid
    const cartUpdated = await CartModel.updateOne(
      { _id: cid },
      { $pull: { productsArray: { prodId: pid } } }
    );
    return cartUpdated;
  }

  async deleteAllProds(cid) {
    const cartReseted = await CartModel.updateOne(
      { _id: cid },
      { $unset: { productsArray: '' } }
    );
    return cartReseted;
  }
}

//export const cartsModel = new Carts();
