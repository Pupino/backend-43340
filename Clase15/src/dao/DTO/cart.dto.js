export default class CartDTO {
  constructor(cart) {
    this.id = cart._id || cart.id; //this is how to handle mongoose _id or memory id
    this.productsArray = [];
    //then cart have an array inside, the entry point is productsArray
    cart.productsArray.forEach((product, index) => {
      this.productsArray.push({
        prodId: product.prodId, //ROMINA! ver que en el caso de Mongo trae toda la descripcion del producto,hacer lo mismo con memoria
        quantity: product.quantity,
      });
    });
  }
}
