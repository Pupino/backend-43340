export default class CartDTO {
  constructor(cart) {
    this.userId = cart[0].userId;
    this.id = cart[0]._id || cart[0].id; //this is how to handle mongoose _id or memory id
    this.productsArray = cart[0].productsArray;
  }
}
